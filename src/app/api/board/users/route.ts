import { UserBoard } from "@/types/user";
import { GetDB } from "@/utils/db";

export async function GET() {
    const db = await GetDB();

    const result = await db.request()
        .query(`SELECT * FROM KanbanProject.Users`)

    const users: UserBoard[] = result.recordset;

    if(users.length === 0) {
        return new Response(JSON.stringify({ message: "No users found", ok: true, data: [] }), { status: 200 });
    }
    return new Response(JSON.stringify({data: users , ok: true }), { status: 200 });
}