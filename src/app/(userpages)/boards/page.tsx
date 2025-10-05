"use client";

import { BoardModal } from "@/components/(usercomponents)/boardModal/BoardModal";
import { Loader } from "@/components/Loader/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import { Board } from "@/types/board";
import { Edit, PlusIcon, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EditBoardModal } from "@/components/(usercomponents)/boardModal/EditBoardModal";


export default function BoardsPage() {
    const [loading, setLoading] = useState(true);
    const [boards, setBoards] = useState<Board[]>([]);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { user } = useUserStore();
    const [editOpen, setEditOpen] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

    const handleEditClick = (board: Board) => {
        setSelectedBoard(board);
        setEditOpen(true);
    };

    const fetchBoards = async () => {
        try {
            console.log("Fetching boards...");
            const res = await fetch('/api/board', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            if (!data.ok) {
                throw new Error(data.error || 'Failed to fetch boards');
            }
            setBoards(data.data);
            console.log(data.data);
        } catch (err) {
            toast.error('Connection error.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (projectName: string, projectDescription: string, selectedUsers: string[]) => {
        try {
            const res = await fetch('/api/board/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: projectName,
                    description: projectDescription,
                    users: selectedUsers
                })
            });
            const data = await res.json();
            if (!data.ok) {
                if (data.error) {
                    toast.error(data.error);
                }
                throw new Error('Error creating board');
            } else {
                toast.success('Board created successfully');
                fetchBoards();
                return true;
            }
        } catch (err) {
            console.error(err);
            toast.error('Error creating board');
            return false;
        }
    }


    useEffect(() => {
        fetchBoards();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader />
            </div>
        )
    }

    return (
        <>
            <Card className="flex flex-col bg-black h-full w-full">
                <CardHeader className="flex flex-row justify-between">
                    <div className="text-2xl font-bold">
                        Boards
                    </div>
                    <div className="flex flex-row gap-2">
                        <Button
                            variant={"dark"}
                            onClick={() => fetchBoards()}
                        >
                            <RefreshCcw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={"dark"}
                            className="flex flex-row gap-2 items-center bg-[color:var(--c-purple)] hover:bg-black"
                            onClick={() => setOpen(true)}
                        >
                            New Board
                            <PlusIcon />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {boards.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="text-lg ">No boards available</div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {boards.map((board: Board) => (
                                <Card
                                    key={board.id}
                                    className="flex flex-col gap-2 w-full bg-black"
                                >
                                    <CardHeader className="flex flex-row justify-between">
                                        <div className="text-lg font-bold">
                                            {board.title}
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <Button
                                                variant={"dark"}
                                                className="border border-[color:var(--c-purple)]"
                                                onClick={() => router.push(`/boards/${board.id}`)}
                                            >
                                                View Board
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-row justify-between">
                                        <div className="text-sm">
                                            {board.description}
                                        </div>
                                        {board.user_id === user?.id ? (
                                            <div>
                                                <Button
                                                    variant={"dark"}
                                                    onClick={() => handleEditClick(board)}
                                                >
                                                    Edit
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </div>) : null}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <EditBoardModal
                board={selectedBoard}
                open={editOpen}
                onOpenChange={setEditOpen}
                onUpdated={fetchBoards}
            />

            <BoardModal
                open={open}
                onOpenChange={() => setOpen(false)}
                onSave={handleSave}
            />
        </>
    );
}