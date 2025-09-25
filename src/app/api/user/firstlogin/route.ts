// app/api/user/firstlogin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GetDB } from "@/utils/db";
import { User } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get("user")?.value;
    if (!cookie) {
      return NextResponse.json(
        { error: "User not authenticated", ok: false },
        { status: 401 }
      );
    }

    const sessionUser: User = JSON.parse(cookie);

    const { username } = await req.json();
    if (!username || !username.trim()) {
      return NextResponse.json(
        { error: "Username is required", ok: false },
        { status: 400 }
      );
    }

    const db = await GetDB();

    await db.request()
      .input("id", sessionUser.id)
      .input("username", username)
      .query(`
        UPDATE KanbanProject.Users
        SET username = @username, first_login = 0
        WHERE id = @id
      `);

    const updatedUser = { ...sessionUser, username, first_login: false };

    const response = NextResponse.json(
      { message: "Username updated successfully", ok: true, data: updatedUser },
      { status: 200 }
    );

    response.cookies.set("user", JSON.stringify(updatedUser), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return response;

  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Error updating user", details: (error as Error)?.message || error, ok: false },
      { status: 500 }
    );
  }
}
