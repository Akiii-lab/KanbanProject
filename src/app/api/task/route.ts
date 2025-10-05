import { GetDB } from "@/utils/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { title, content, user_id, board_id, state_id } = await req.json();

    const user = req.cookies.get("user")?.value;
    if (!user || !title || !user_id || !board_id) {
        return new Response(JSON.stringify({ error: "Missing required fields", ok: false }), { status: 400 });
    }

    // Normalize state_id: use provided numeric value, otherwise default to 1 (To Do)
    const normalizedStateId = (typeof state_id === 'number' && !isNaN(state_id)) ? state_id : 1;

    const db = await GetDB();

    try {
            await db.request()
            .input('title', title)
            .input('content', content)
            .input('userId', user_id)
            .input('boardId', board_id)
            .input('stateId', normalizedStateId)
            .input('createdAt', new Date(Date.now()))
            .query(`
                INSERT INTO KanbanProject.Tasks (title, content, user_id, board_id, state_id, created_at)
                VALUES (@title, @content, @userId, @boardId, @stateId, @createdAt)
            `);

        return new Response(JSON.stringify({ message: "Task created successfully", ok: true }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Error creating task", ok: false }), { status: 500 });
    }
}