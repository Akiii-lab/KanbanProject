import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const cookieStore = cookies();
    try {
        return new Response(JSON.stringify({ message: 'Sesión cerrada correctamente' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error al cerrar sesión', details: error }), { status: 500 });
    }
}
