import { NextRequest, NextResponse } from 'next/server';
import { GetDB } from '@/utils/db';

export async function POST(req: NextRequest) {
    const { email, password, confirmPassword } = await req.json();
    
    const now = new Date();

    const create_time = new Date(now.getTime() - (5 * 60 * 60 * 1000)); // Time Colombia (UTC-5)

    try {
        if ( !email || !password || !confirmPassword) {
            return NextResponse.json({ error: 'Username, email y password son requeridos' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 });
        }

        const db = await GetDB();

        const result = await db.request().query(`SELECT * FROM KanbanProject.Users WHERE email = '${email}'`);

        if (result.recordset.length > 0) {
            return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
        }

        await db.request()
            .input('email', email)
            .input('password', password)
            .input('create_time', create_time)
            .query(`INSERT INTO KanbanProject.Users (email, password, create_time) VALUES (@email, @password, @create_time);`);
            

        return NextResponse.json({ message: 'Usuario registrado exitosamente', ok: true }, { status: 201 });
    } catch (error: unknown) {
        console.log(error);
        return NextResponse.json({ error: 'Error al registrar el usuario', details: (error as Error)?.message || error, ok: false }, { status: 500 });
        
    }
}