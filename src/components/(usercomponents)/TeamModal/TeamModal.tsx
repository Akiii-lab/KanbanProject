"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SaveTask, UserTask } from "@/types/task";
import { Label } from '@radix-ui/react-label';
import { User } from 'lucide-react';
import { useRef, useState } from 'react';

interface TeamModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    users: UserTask[];
    ownerId?: number;
}

export const TeamModal = ({
    isOpen,
    onOpenChange,
    users,
    ownerId
}: TeamModalProps) => {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Team</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4 max-h-full overflow-y-auto'>
                    {users.map(user => (
                        <Card key={user.id} className='bg-black'>
                            <CardContent className='flex flex-row items-center gap-2'>
                                <User className={`${user.id === ownerId ? 'text-[color:var(--c-violet)]' : ''}`} />
                                <p>{user.username} ({user.email}) {user.id === ownerId && <span>(Owner)</span>}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className='flex flex-row justify-end gap-2 mt-4'>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>Close</Button>
                    <Button variant='dark' onClick={() => setOpen(true)}>Add Member</Button>
                </div>

                {/* TODO:Add Member Modal */}
                {open && <div className='mt-4 p-4 border border-[color:var(--c-purple)] rounded-lg'>
                    <p className='mb-2'>Add Member functionality coming soon!</p>
                    <Button variant='outline' onClick={() => setOpen(false)}>Close</Button>
                </div>}
            </DialogContent>
        </Dialog>
    )
}