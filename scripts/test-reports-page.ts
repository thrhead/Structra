import { getReportStats, getWeeklyCompletedSteps, getTeamPerformance, getJobsListForFilter, getCategoriesForFilter } from '../src/lib/data/reports.ts';

async function main() {
    try {
        const from = new Date('2026-03-01T00:00:00.000Z');
        const to = new Date();
        const jobStatus = 'all';
        const jobId = 'all';
        const category = 'all';

        console.log('Testing getJobsListForFilter...');
        await getJobsListForFilter(jobStatus);
        
        console.log('Testing getCategoriesForFilter...');
        await getCategoriesForFilter();

        console.log('Testing getReportStats...');
        await getReportStats(from, to, jobStatus, jobId, category);

        console.log('Testing getTeamPerformance...');
        await getTeamPerformance(from, to, jobStatus, jobId);

        console.log('Testing getWeeklyCompletedSteps...');
        await getWeeklyCompletedSteps();

        console.log('ALL PASSED');
    } catch(e) {
        console.error('ERROR OCCURRED:', e);
    }
}
main();
