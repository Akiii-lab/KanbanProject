import { NextRequest, NextResponse } from 'next/server';
import { GetDB } from '@/utils/db';

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    try {
        if (!email || !password) {
            return NextResponse.json({ error: 'Email y password son requeridos' }, { status: 400 });
        }

        const db = await GetDB();

        await db.request()
            .input('email', email)
            .input('password', password)
            .query(`INSERT INTO KanbanProject.Users (email, password) VALUES (@email, @password)`);

        return NextResponse.json({ message: 'Usuario registrado exitosamente', ok: true }, { status: 201 });
    } catch (error: any) {
        // Mostrar el mensaje real del error para depuración
        return NextResponse.json({ error: 'Error al registrar el usuario', details: error?.message || error, ok: false }, { status: 500 });
    }
}