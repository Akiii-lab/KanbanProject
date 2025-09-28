"use client";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SaveTask, UserTask } from "@/types/task";
import { Label } from '@radix-ui/react-label';
import { useRef, useState } from 'react';

interface CreateTaskModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: SaveTask) => void;
    users: UserTask[];
    isEdit?: boolean | null;
}

export const CreateTaskModal = ({
    isOpen,
    onOpenChange,
    onSubmit,
    users,
    isEdit
}: CreateTaskModalProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState<SaveTask>({
        title: '',
        content: '',
        user_id: 0
    });

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return;
        setFiles(prev => [...prev, ...Array.from(fileList)]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Task" : "Create Task"}</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <Label>Task Title</Label>
                        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task Title" />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label>Task Description</Label>
                        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Task Description" className='border p-2 rounded-md' />
                    </div>
                    {/* TODO: Add file in endpoint */}
                    <div className='flex flex-col gap-2'>
                        <Label>Documents</Label>
                        <div
                            className="w-full border-2 border-dashed rounded-md p-4 text-center cursor-pointer bg-black hover:bg-accent transition"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {files.length === 0 && <span className="block mb-2 text-sm text-gray-500">Drop files here or click to select</span>}
                            <Input
                                type="file"
                                multiple
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                            />
                            {files.length > 0 && (
                                <ul className="text-left text-xs">
                                    {files.map((file, idx) => (
                                        <li key={idx} className="truncate">{file.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label>Assignee</Label>
                        <Select onValueChange={(value) => setForm({ ...form, user_id: parseInt(value) })}>
                            <SelectTrigger className="mt-2 w-full">
                                <SelectValue placeholder="Select Assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.username} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex flex-row gap-2 justify-end'>
                        <Button
                            variant={"dark"}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={"midLight"}
                            onClick={() => onSubmit(form)}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}