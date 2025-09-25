import { GetDB } from "@/utils/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {

    const { description, name, users } = await req.json();
    const user = req.cookies.get("user")?.value;
    if (!user || !name || !description) {
        return new Response(JSON.stringify({ error: "Missing required fields", ok: false }), { status: 400 });
    }

    const id = JSON.parse(user).id;
    const db = await GetDB();

    const allUsers = Array.from(new Set([id, ...(users || [])]));

    try {
        const res = await db.request()
            .input('title', name)
            .input('description', description)
            .input('userId', id)
            .input('createdAt', new Date(Date.now()))
            .query(`
                INSERT INTO KanbanProject.Boards (title, description, user_id, created_at)
                OUTPUT INSERTED.id
                VALUES (@title, @description, @userId, @createdAt)
            `);

        const boardId = res.recordset[0].id;

        for (const userId of allUsers) {
            await db.request()
                .input('boardId', boardId)
                .input('userId', userId)
                .query(`INSERT INTO KanbanProject.BoardUsers (board_id, user_id) VALUES (@boardId, @userId)`);
        }
        return new Response(JSON.stringify({ message: "Board created successfully", ok: true }), { status: 201 });
    } catch (error) {
        console.error("Error creating board:", error);
        return new Response(JSON.stringify({ error: "Error creating board", ok: false }), { status: 500 });
    }
}