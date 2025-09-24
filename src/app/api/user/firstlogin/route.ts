// app/api/user/firstlogin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GetDB } from "@/utils/db";
import { User } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Tomar la cookie de sesión
    const cookie = req.cookies.get("user")?.value;
    if (!cookie) {
      return NextResponse.json(
        { error: "Usuario no autenticado", ok: false },
        { status: 401 }
      );
    }

    const sessionUser: User = JSON.parse(cookie);

    // 2️⃣ Leer el nuevo username del body
    const { username } = await req.json();
    if (!username || !username.trim()) {
      return NextResponse.json(
        { error: "Nombre de usuario requerido", ok: false },
        { status: 400 }
      );
    }

    // 3️⃣ Conectar a la base de datos
    const db = await GetDB();

    // 4️⃣ Actualizar el username y marcar first_login como false
    await db.request()
      .input("id", sessionUser.id)
      .input("username", username)
      .query(`
        UPDATE KanbanProject.Users
        SET username = @username, first_login = 0
        WHERE id = @id
      `);

    // 5️⃣ Actualizar cookie con el nuevo username y firstLogin = false
    const updatedUser = { ...sessionUser, username, firstLogin: false };

    const response = NextResponse.json(
      { message: "Nombre actualizado correctamente", ok: true, data: updatedUser },
      { status: 200 }
    );

    response.cookies.set("user", JSON.stringify(updatedUser), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar usuario", details: error?.message || error, ok: false },
      { status: 500 }
    );
  }
}
