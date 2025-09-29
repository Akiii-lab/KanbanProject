import { Board } from "@/types/board";
import { Task, UserTask } from "@/types/task";
import { GetDB } from "@/utils/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = req.cookies.get("user")?.value;

    if (!user) {
        return new Response(JSON.stringify({ error: "User not authenticated", ok: false }), { status: 401 });
    }

    const db = await GetDB();

    try {
        const result = await db.request()
            .input('boardId', id)
            .query('SELECT * FROM KanbanProject.Boards WHERE id = @boardId');

        const board: Board | null = result.recordset[0];

        if (!board) {
            return new Response(JSON.stringify({ error: "Board not found", ok: false }), { status: 404 });
        }

        const resultTasks = await db.request()
            .input('boardId', id)
            .query('SELECT * FROM KanbanProject.Tasks WHERE board_id = @boardId');

        const tasks: Task[] | null = resultTasks.recordset;

        const resultUserTasks = await db.request()
            .input('boardId', id)
            .query(`SELECT * FROM KanbanProject.Users us
                    JOIN KanbanProject.BoardUsers bu ON us.id = bu.user_id
                    WHERE bu.board_id = @boardId`);

        const userTasks: UserTask[] = [];

        for (const rUser of resultUserTasks.recordset) {
            userTasks.push({
                id: rUser.id[0],
                username: rUser.username,
                email: rUser.email,
            });
        }
        return new Response(JSON.stringify({ ok: true, data: { board, tasks, userTasks } }), { status: 200 });
    } catch (error) {
        console.error("Error fetching board:", error);
        return new Response(JSON.stringify({ ok: false, error: "Internal Server Error" }), { status: 500 });
    }
}
