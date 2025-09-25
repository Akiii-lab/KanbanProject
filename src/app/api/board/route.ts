import { Board } from "@/types/board";
import { GetDB } from "@/utils/db";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
    console.log("API /api/board called");
    const user = req.cookies.get("user")?.value;
    if(!user) {
        return new Response(JSON.stringify({ error: "User not authenticated", ok: false }), { status: 401 });
    }

    const id = JSON.parse(user).id;
    const db = await GetDB();
    console.log("Fetching boards for user ID:", id);
    const result = await db.request()
        .input('userId', id)
        .query(`
            SELECT b.*
            FROM KanbanProject.Boards b
            INNER JOIN KanbanProject.BoardUsers bu ON b.id = bu.board_id
            WHERE bu.user_id = @userId
        `)

    const boards: Board[] = result.recordset;

    if(boards.length === 0) {
        return new Response(JSON.stringify({ message: "No boards found", ok: true, data: [] }), { status: 200 });
    }
    return new Response(JSON.stringify({ data: boards, ok: true }), { status: 200 });
}