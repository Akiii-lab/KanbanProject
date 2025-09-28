import { GetDB } from "@/utils/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { title, content, user_id, board_id } = await req.json();

    const user = req.cookies.get("user")?.value;
    if (!user || !title || !user_id || !board_id) {
        return new Response(JSON.stringify({ error: "Missing required fields", ok: false }), { status: 400 });
    }

    const db = await GetDB();

    try {
        await db.request()
            .input('title', title)
            .input('content', content)
            .input('userId', user_id)
            .input('boardId', board_id)
            .input('createdAt', new Date().toISOString().split('T')[0])
            .query(`
                INSERT INTO KanbanProject.Tasks (title, content, user_id, board_id, state_id, create_date)
                VALUES (@title, @content, @userId, @boardId, 1, @createdAt)
            `);

        return new Response(JSON.stringify({ message: "Task created successfully", ok: true }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Error creating task", ok: false }), { status: 500 });
    }
}