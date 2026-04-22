
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminOrManager } from '@/lib/auth-helper'

// Simple Haversine for initial estimation
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// OSRM Matrix API would be ideal, but for now we implement a robust grouping and multi-route logic
// that can easily be extended to OSRM matrix calls.
function optimizeRouteForTeam(jobs: any[], center: { lat: number, lon: number } | null) {
    if (jobs.length === 0) return { route: [], distanceKm: 0 };

    const unvisited = [...jobs];
    const optimized: any[] = [];

    // Start from center or the first job
    let currentPos = center || {
        lat: unvisited[0].latitude || 0,
        lon: unvisited[0].longitude || 0
    };

    let totalDistanceKm = 0;

    while (unvisited.length > 0) {
        let closestIdx = 0;
        let minDistance = Infinity;

        for (let i = 0; i < unvisited.length; i++) {
            const dist = getDistance(
                currentPos.lat,
                currentPos.lon,
                unvisited[i].latitude || 0,
                unvisited[i].longitude || 0
            );

            if (dist < minDistance) {
                minDistance = dist;
                closestIdx = i;
            }
        }

        const nextJob = unvisited.splice(closestIdx, 1)[0];
        optimized.push(nextJob);
        currentPos = { lat: nextJob.latitude || 0, lon: nextJob.longitude || 0 };
        totalDistanceKm += minDistance;
    }

    return { route: optimized, distanceKm: parseFloat(totalDistanceKm.toFixed(2)) };
}

export async function POST(req: Request) {
    try {
        const session = await verifyAdminOrManager(req)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { date, teamId, fromCenter, centerLat, centerLon } = await req.json();

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch jobs with their assignments and teams
        const jobs = await prisma.job.findMany({
            where: {
                scheduledDate: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                customer: { select: { company: true } },
                assignments: {
                    include: {
                        team: { select: { id: true, name: true } }
                    }
                }
            }
        });

        const center = fromCenter ? { lat: centerLat || 41.0082, lon: centerLon || 28.9784 } : null;

        // Group jobs by team
        const teamGroups: Record<string, any[]> = {};
        const unassignedJobs: any[] = [];

        jobs.forEach(job => {
            const assignment = job.assignments.find(a => a.teamId);
            if (assignment && assignment.team) {
                const tId = assignment.team.id;
                if (!teamGroups[tId]) teamGroups[tId] = [];
                teamGroups[tId].push({
                    ...job,
                    teamName: assignment.team.name
                });
            } else {
                unassignedJobs.push(job);
            }
        });

        // Optimize each team's route
        const results: any[] = [];

        for (const tId in teamGroups) {
            const teamJobs = teamGroups[tId];
            const jobsWithCoords = teamJobs.filter(j => j.latitude !== null && j.longitude !== null);
            const optimizedResult = optimizeRouteForTeam(jobsWithCoords, center);
            const withoutCoords = teamJobs.filter(j => j.latitude === null || j.longitude === null);

            results.push({
                teamId: tId,
                teamName: teamJobs[0].teamName,
                jobs: [...optimizedResult.route, ...withoutCoords],
                metrics: {
                    totalDistanceKm: optimizedResult.distanceKm,
                    jobCount: teamJobs.length
                }
            });
        }

        // Handle unassigned
        if (unassignedJobs.length > 0) {
            const jobsWithCoords = unassignedJobs.filter(j => j.latitude !== null && j.longitude !== null);
            const optimizedResult = optimizeRouteForTeam(jobsWithCoords, center);
            const withoutCoords = unassignedJobs.filter(j => j.latitude === null || j.longitude === null);

            results.push({
                teamId: 'unassigned',
                teamName: 'Atanmamış İşler',
                jobs: [...optimizedResult.route, ...withoutCoords],
                metrics: {
                    totalDistanceKm: optimizedResult.distanceKm,
                    jobCount: unassignedJobs.length
                }
            });
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('Route optimization error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
