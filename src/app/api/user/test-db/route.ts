import { NextResponse } from 'next/server';
import { testDBConnection } from '@/utils/db';

export async function GET() {
    try {
        const user = await testDBConnection();
        return NextResponse.json({ ok: true, user });
    } catch (error: unknown) {
        return NextResponse.json({ ok: false, error: (error as Error)?.message || error });
    }
}
