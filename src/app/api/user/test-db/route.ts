import { NextResponse } from 'next/server';
import { testDBConnection } from '@/utils/db';

export async function GET() {
    try {
        const user = await testDBConnection();
        return NextResponse.json({ ok: true, user });
    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error?.message || error });
    }
}
