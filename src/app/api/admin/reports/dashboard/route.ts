import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-helper';
import { getStrategicDashboard, getTacticalDashboard, getOperationalDashboard } from '@/lib/data/reports';

export async function GET(request: Request) {
    try {
        const session = await verifyAuth(request);
        if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const fromStr = searchParams.get('from');
        const toStr = searchParams.get('to');

        // Default to last 30 days if no dates provided
        const from = fromStr ? new Date(fromStr) : new Date(new Date().setDate(new Date().getDate() - 30));
        const to = toStr ? new Date(toStr) : new Date();

        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);

        const [strategic, tactical, operational] = await Promise.all([
            getStrategicDashboard(from, to),
            getTacticalDashboard(from, to),
            getOperationalDashboard(from, to)
        ]);

        return NextResponse.json({
            strategic,
            tactical,
            operational
        });
    } catch (error) {
        console.error('Mobile Dashboard Report Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
