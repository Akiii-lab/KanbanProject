import { GetDB } from "@/utils/db";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: taskId } = await params;
    const user = req.cookies.get("user")?.value;

    if (!user) {
        return new Response(JSON.stringify({ error: "User not authenticated", ok: false }), { status: 401 });
    }

    try {
        const body = await req.json();
        const { state_id } = body;

        if (!state_id || isNaN(parseInt(state_id))) {
            return new Response(JSON.stringify({ error: "Invalid state_id", ok: false }), { status: 400 });
        }

        const db = await GetDB();

        const taskResult = await db.request()
            .input('taskId', taskId)
            .query('SELECT * FROM KanbanProject.Tasks WHERE id = @taskId');

        if (taskResult.recordset.length === 0) {
            return new Response(JSON.stringify({ error: "Task not found", ok: false }), { status: 404 });
        }

        const date = new Date().toISOString().split('T')[0];
        await db.request()
            .input('taskId', taskId)
            .input('stateId', parseInt(state_id))
            .input('updatedAt', date)
            .query('UPDATE KanbanProject.Tasks SET state_id = @stateId, updated_at = @updatedAt WHERE id = @taskId');

        return new Response(JSON.stringify({ ok: true, message: "Task updated successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error updating task:", error);
        return new Response(JSON.stringify({ ok: false, error: "Internal Server Error" }), { status: 500 });
    }
}