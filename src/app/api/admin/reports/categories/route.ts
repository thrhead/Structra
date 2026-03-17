import { NextResponse } from 'next/server';
import { getCategoriesForFilter } from '@/lib/data/reports';
import { verifyAdminOrManager } from '@/lib/auth-helper';

export async function GET(req: Request) {
    const session = await verifyAdminOrManager(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const categories = await getCategoriesForFilter();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json([], { status: 500 });
    }
}
