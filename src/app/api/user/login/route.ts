import { User } from '@/types/user';
import { GetDB } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

// Extendemos User con el campo de la DB
type DBUser = User & { first_login: boolean };

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    try {
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y password son requeridos' }, 
                { status: 400 }
            );
        }

        const db = await GetDB();

        const result = await db.request()
            .input('email', email)
            .input('password', password)
            .query(`
                SELECT id, email, username, first_login 
                FROM KanbanProject.Users 
                WHERE email = @email AND password = @password
            `);

        const user: DBUser | undefined = result.recordset[0];

        if (!user) {
            return NextResponse.json(
                { error: 'Credenciales incorrectas' }, 
                { status: 401 }
            );
        }

        // Preparamos la redirección con base en first_login
        const redirect = user.first_login ? '/onboarding' : '/dashboard';

        // Creamos cookie de sesión
        const response = NextResponse.json(
            { 
                message: 'Usuario iniciado exitosamente', 
                ok: true, 
                data: user,
                redirect
            }, 
            { status: 201 }
        );

        response.cookies.set('user', JSON.stringify(user), {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
        });

        return response;

    } catch (error: any) {
        return NextResponse.json(
            { 
                error: 'Error al iniciar sesión con el usuario', 
                details: error?.message || error, 
                ok: false 
            }, 
            { status: 500 }
        );
    }
}
