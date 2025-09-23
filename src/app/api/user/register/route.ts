import { NextRequest, NextResponse } from 'next/server';
import { GetDB } from '@/utils/db';

export async function POST(req: NextRequest) {
    const { username, email, password, confirmPassword  } = await req.json();
    const create_time = new Date(Date.now()); // Crear un objeto Date en lugar de timestamp
    try {
        if (!username || !email || !password || !confirmPassword) {
            return NextResponse.json({ error: 'Username, email y password son requeridos' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 });
        }

        const db = await GetDB();

        await db.request()
            .input('username', username)
            .input('email', email)
            .input('password', password)
            .input('create_time', create_time)
            .query(`INSERT INTO KanbanProject.Users (username, email, password, create_time) VALUES (@username, @email, @password, @create_time);`);

        return NextResponse.json({ message: 'Usuario registrado exitosamente', ok: true }, { status: 201 });
    } catch (error: any) {
        // Mostrar el mensaje real del error para depuración
        return NextResponse.json({ error: 'Error al registrar el usuario', details: error?.message || error, ok: false }, { status: 500 });
    }
}