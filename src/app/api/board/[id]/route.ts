import { Board } from "@/types/board";
import { Task, UserTask } from "@/types/task";
import { GetDB } from "@/utils/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = req.cookies.get("user")?.value;

    if(!user) {
        return new Response(JSON.stringify({ error: "User not authenticated", ok: false }), { status: 401 });
    }

    const db = await GetDB();

    try {
        const result = await db.request()
            .input('boardId', id)
            .query('SELECT * FROM KanbanProject.Boards WHERE id = @boardId');
        
        const board: Board | null = result.recordset[0];

        if(!board) {
            return new Response(JSON.stringify({ error: "Board not found", ok: false }), { status: 404 });
        }

        const resultTasks = await db.request()
            .input('boardId', id)
            .query('SELECT * FROM KanbanProject.Tasks WHERE board_id = @boardId');

        const tasks : Task[] | null = resultTasks.recordset;

        const resultUserTasks = await db.request()
            .input('boardId', id)
            .query(`SELECT us.* FROM KanbanProject.Users us
                    JOIN KanbanProject.Tasks t ON us.id = t.user_id
                    WHERE t.board_id = @boardId`);

    const userTasks: UserTask[] | null = resultUserTasks.recordset;

        return new Response(JSON.stringify({ ok: true, data: { board, tasks, userTasks } }), { status: 200 });
    } catch (error) {
        console.error("Error fetching board:", error);
        return new Response(JSON.stringify({ ok: false, error: "Internal Server Error" }), { status: 500 });
    }
}

export async function PUT(req: NextRequest,{ params }: { params: Promise<{ id: string }>}){
    const { id } = await params;
    const user = req.cookies.get("user")?.value;

    if (!user) {
        return new Response(
        JSON.stringify({ error: "User not authenticated", ok: false }),
        { status: 401 }
        );
    }

    const db = await GetDB();

    try {
        const { title, description } = await req.json();

        if (!title || !description) {
        return new Response(
            JSON.stringify({
            ok: false,
            error: "Title and description are required",
            }),
            { status: 400 }
        );
        }

        const result = await db
        .request()
        .input("boardId", id)
        .input("title", title)
        .input("description", description)
        .query(
            `UPDATE KanbanProject.Boards 
            SET title = @title, description = @description
            WHERE id = @boardId`
        );

        if (result.rowsAffected[0] === 0) {
        return new Response(
            JSON.stringify({ ok: false, error: "Board not found" }),
            { status: 404 }
        );
        }

        return new Response(
        JSON.stringify({
            ok: true,
            message: "Board updated successfully",
        }),
        { status: 200 }
        );
    } catch (error) {
        console.error("Error updating board:", error);
        return new Response(
        JSON.stringify({ ok: false, error: "Internal Server Error" }),
        { status: 500 }
        );
    }
}




export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = req.cookies.get("user")?.value;

  if (!user) {
    return new Response(
      JSON.stringify({ error: "User not authenticated", ok: false }),
      { status: 401 }
    );
  }

  const db = await GetDB();

  try {
    console.log(`Deleting board with id: ${id}`);

    // 1. Eliminar relaciones en BoardUsers
    await db
      .request()
      .input("boardId", id)
      .query(`DELETE FROM KanbanProject.BoardUsers WHERE board_id = @boardId`);

    // 2. Eliminar tareas relacionadas (si existen)
    await db
      .request()
      .input("boardId", id)
      .query(`DELETE FROM KanbanProject.Tasks WHERE board_id = @boardId`);

    // 3. Eliminar el board en sí
    const result = await db
      .request()
      .input("boardId", id)
      .query(`DELETE FROM KanbanProject.Boards WHERE id = @boardId`);

    if (!result.rowsAffected || result.rowsAffected[0] === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "Board not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, message: "Board deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting board:", error);
    return new Response(
      JSON.stringify({ ok: false, error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

