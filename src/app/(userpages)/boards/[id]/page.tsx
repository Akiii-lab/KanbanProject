"use client";
import { Loader } from "@/components/Loader/loader";
import { Button } from "@/components/ui/button";
import { Board } from "@/types/board";
import { Task, UserTask } from "@/types/task";
import { PlusIcon, Users2 } from "lucide-react";
import { use, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { DroppableColumn } from "@/components/(usercomponents)/DroppableColumn/DroppableColumn";

interface BoardPageProps {
    params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
    const { id } = use(params);
    const [boardData, setBoardData] = useState<Board | null>(null);
    const [Tasks, setTasks] = useState<Task[] | null>(null);
    const [users, setUsers] = useState<UserTask[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pendingTasks: 0,
        finishedTasks: 0,
        underReviewTasks: 0,
        inProgressTasks: 0,
    });

    const fetchBoardData = useCallback(async () => {
        try {
            const res = await fetch(`/api/board/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (!data.ok) {
                throw new Error(data.error || "Failed to fetch board data");
            }
            setBoardData(data.data.board);
            setTasks(data.data.tasks);
            handleStats(data.data.tasks);
            setUsers(data.data.userTasks);
            return data.data;
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Error fetching board data");
            }
        } finally {
            setLoading(false);
        }
    }, [id]); // Ahora id es la única dependencia real

    const handleStats = (Tasks: Task[]) => {
        if (!Tasks) return;
        const pendingTasks = Tasks.filter((task) => task.state_id === 1).length;
        const inProgressTasks = Tasks.filter((task) => task.state_id === 2).length;
        const underReviewTasks = Tasks.filter((task) => task.state_id === 3).length;
        const finishedTasks = Tasks.filter((task) => task.state_id === 4).length;
        setStats({
            pendingTasks,
            underReviewTasks,
            inProgressTasks,
            finishedTasks,
        });
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over || !active.data.current?.task) return;
        
        const taskId = parseInt(active.id as string);
        const newStateId = parseInt(over.id as string);
        const task = active.data.current.task as Task;
        
        if (task.state_id === newStateId) return;
        
        try {
            const updatedTasks = Tasks?.map(t => 
                t.id === taskId ? { ...t, state_id: newStateId } : t
            ) || [];
            
            setTasks(updatedTasks);
            handleStats(updatedTasks);
            
            const response = await fetch(`/api/task/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    state_id: newStateId,
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            
            toast.success('Task moved successfully');
        } catch (error) {
            if (Tasks) {
                setTasks(Tasks);
                handleStats(Tasks);
            }
            toast.error('Failed to move task');
            console.error('Error updating task:', error);
        }
    };

    useEffect(() => {
        fetchBoardData();
    }, [fetchBoardData]); // Ahora fetchBoardData es estable gracias a useCallback

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader />
            </div>
        )
    }

    if (!boardData) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="text-xl font-semibold">No board found</span>
            </div>
        )
    }

    return (
        <div className="p-4 h-full flex flex-col gap-5">
            {/* div para el header de la board */}
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold mb-4">{boardData.title}</h1>
                    <p>{boardData.description}</p>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <Button variant="dark">
                        <Users2 size={24} />
                        Team
                    </Button>
                    <Button
                        className="bg-[color:var(--c-violet)] hover:bg-[color:var(--c-purple)] hover:cursor-pointer"
                    >
                        Create New Task
                        <PlusIcon size={24} />
                    </Button>
                </div>
            </div>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="flex flex-row grid-cols-4 w-full items-start justify-between flex-1 overflow-hidden">
                    <DroppableColumn
                        id="1"
                        title="To Do"
                        color="#d0021b"
                        tasks={Tasks?.filter((task) => task.state_id === 1) || []}
                        count={stats.pendingTasks}
                    />
                    <DroppableColumn
                        id="2"
                        title="In Progress"
                        color="#f8e71c"
                        tasks={Tasks?.filter((task) => task.state_id === 2) || []}
                        count={stats.inProgressTasks}
                    />
                    <DroppableColumn
                        id="3"
                        title="In Review"
                        color="#f5a623"
                        tasks={Tasks?.filter((task) => task.state_id === 3) || []}
                        count={stats.underReviewTasks}
                    />
                    <DroppableColumn
                        id="4"
                        title="Finished"
                        color="#3bf683"
                        tasks={Tasks?.filter((task) => task.state_id === 4) || []}
                        count={stats.finishedTasks}
                    />
                </div>
            </DndContext>
        </div>
    );
}