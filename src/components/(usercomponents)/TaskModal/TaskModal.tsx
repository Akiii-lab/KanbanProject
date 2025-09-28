"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/types/task";
import { useState } from "react";

interface TaskModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task | null;
    user: string;
    userEmail: string;
    onSave: (task: number, state: number) => void;
    onDelete: (task: number) => void;
}

export const TaskModal = ({ isOpen, onOpenChange, task, user, userEmail, onSave, onDelete }: TaskModalProps) => {

    if (!task) return null;

    const [stateId, setStateId] = useState(task.state_id);
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>{task.title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {task.content}
                </DialogDescription>
                {/* TODO: when files are added, show files here */}

                <Label>Assigned to:</Label>
                <p>{user} ({userEmail})</p>

                <Label>Change State</Label>
                <Select onValueChange={(value) => {
                    setStateId(parseInt(value));
                }}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={task.state_id === 1 ? "To Do" : task.state_id === 2 ? "In Progress" : task.state_id === 3 ? "In Review" : "Finished"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">To Do</SelectItem>
                        <SelectItem value="2">In Progress</SelectItem>
                        <SelectItem value="3">In Review</SelectItem>
                        <SelectItem value="4">Finished</SelectItem>
                    </SelectContent>
                </Select>
                <div className='flex flex-row justify-between gap-2'>
                    <Button
                        variant='destructive'
                        onClick={() => onDelete(task.id)}
                    >
                        Delete Task
                    </Button>
                    <div className='flex flex-row justify-end gap-2'>
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant={"dark"}
                        >
                            Close
                        </Button>
                        <Button
                            variant={"midLight"}
                            onClick={() => onSave(task.id, stateId)}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}