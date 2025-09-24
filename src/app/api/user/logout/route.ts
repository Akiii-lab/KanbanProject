import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = new NextResponse(JSON.stringify({ message: 'Sesión cerrada correctamente', ok: true }), { status: 200 });
        response.cookies.set('user', '', {
            path: '/',
            expires: new Date(0),
        });
        return response;
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Error al cerrar sesión', details: error, ok: false }), { status: 500 });
    }
}
