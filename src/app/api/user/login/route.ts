import { NextRequest, NextResponse } from 'next/server';
import { GetDB } from '@/utils/db';
import { User } from '@/types/user';

export async function POST(req: NextRequest) {
    //TODO: validate email and password is correct and exist in database 
    const { email, password } = await req.json();

    try {
        if (!email || !password) {
            return NextResponse.json({ error: 'Email y password son requeridos' }, { status: 400 });
        }

        const db = await GetDB();

        const result = await db.request()
            .input('email', email)
            .input('password', password)
            .query(`SELECT * FROM KanbanProject.Users WHERE email = @email AND password = @password`);

        const user: User | undefined = result.recordset[0];
        if (!user) {
            return NextResponse.json(
                { error: 'Credenciales inválidas', ok: false },
                { status: 401 }
            );
        }
        const response = NextResponse.json({ message: 'Usuario iniciado exitosamente', ok: true, data: user }, { status: 201 });
        response.cookies.set('user', JSON.stringify(user), {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        return response;
    } catch (error: unknown) {
        return NextResponse.json({ error: 'Error al iniciar sesión con el usuario', details: (error as Error)?.message || error, ok: false }, { status: 500 });
    }
}