import { GetDB } from "@/utils/db";
import { stat } from "fs";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const user = req.cookies.get("user")?.value;
    if (!user) {
        return new Response(JSON.stringify({ error: "User not authenticated", ok: false }), { status: 401 });
    }

    try {
        const db = await GetDB();
        const id = JSON.parse(user).id;

        const resBoards = await db.request()
            .input('userId', id)
            .query(`
            SELECT COUNT(*) as total FROM KanbanProject.BoardUsers bu WHERE bu.user_id = @userId
        `);

        const boards = resBoards.recordset[0].total;

        const resTasks = await db.request()
            .input('userId', id)
            .query(`
            SELECT * FROM KanbanProject.Tasks t WHERE t.user_id = @userId
        `);

        const tasks = resTasks.recordset;
        let completedTasks = 0;
        let activeTasks = 0;

        const activityData: { [key: string]: number } = {};
        const taskStatusData: { [key: number]: number } = {};
        for (const task of tasks) {
            if (task.state_id != 4) {
                activeTasks++;
            } else {
                completedTasks++;
            }
            taskStatusData[task.state_id] = (taskStatusData[task.state_id] || 0) + 1;
            if (task.updated_at != null) {
                activityData[new Date(task.updated_at).toISOString().split('T')[0]] = (activityData[new Date(task.updated_at).toISOString().split('T')[0]] || 0) + 1;
            }
        }

        const recentlyUpdatedTask = tasks.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
        const recentlyTask = tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        const oldTask = tasks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];

        let mostRecentlyUpdated = null;
        let mostRecentlyCreated = null;
        let oldestTask = null;

        if (recentlyUpdatedTask) {
            const updatedRes = await db.request().input('boardId', recentlyUpdatedTask.board_id).query(`
            SELECT title FROM KanbanProject.Boards WHERE id = @boardId
            `);
            mostRecentlyUpdated = {
                title: recentlyUpdatedTask.title,
                content: recentlyUpdatedTask.content,
                date: recentlyUpdatedTask.updated_at,
                board: updatedRes.recordset[0]?.title || "Unknown",
                state: recentlyUpdatedTask.state_id
            }
        }
        if (recentlyTask) {
            const recentRes = await db.request().input('boardId', recentlyTask.board_id).query(`
            SELECT title FROM KanbanProject.Boards WHERE id = @boardId
        `);
            mostRecentlyCreated = {
                title: recentlyTask.title,
                content: recentlyTask.content,
                date: recentlyTask.created_at,
                board: recentRes.recordset[0]?.title || "Unknown",
                state: recentlyTask.state_id
            }
        }
        if (oldTask) {
            const oldRes = await db.request().input('boardId', oldTask.board_id).query(`
            SELECT title FROM KanbanProject.Boards WHERE id = @boardId
        `);
            oldestTask = {
                title: oldTask.title,
                content: oldTask.content,
                date: oldTask.created_at,
                board: oldRes.recordset[0]?.title || "Unknown",
                state: oldTask.state_id
            }
        }
        return new Response(JSON.stringify({
            data: {
                boards,
                activeTasks,
                completedTasks,
                activityData,
                taskStatusData,
                mostRecentlyUpdated,
                mostRecentlyCreated,
                oldestTask
            },
            ok: true
        }), { status: 200 });

    } catch (error) {
        console.error("Error fetching user graphs data:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", ok: false }), { status: 500 });
    }
}