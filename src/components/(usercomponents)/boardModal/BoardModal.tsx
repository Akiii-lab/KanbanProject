import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Loader } from "@/components/Loader/loader";
import { useBoardStore } from "@/store/boardStore";
import { useUserStore } from "@/store/userStore";
import { on } from "events";

interface BoardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (name: string, description: string, users: string[]) => Promise<boolean>;
}
export const BoardModal = ({
    open,
    onOpenChange,
    onSave
}: BoardModalProps) => {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const {
        users,
        usersLoading,
        fetchUsers
    } = useBoardStore();
    const { user } = useUserStore();

    const handleUserSelect = (userId: string) => {
        if (!selectedUsers.includes(userId)) {
            setSelectedUsers(prev => [...prev, userId]);
        }
    };
    const removeUser = (userId: string) => {
        setSelectedUsers(prev => prev.filter(id => id !== userId));
    };
    const getUserById = (userId: string) => {
        return users.find(user => user.id.toString() === userId);
    };

    const handleSave = async () => {

        if (!projectName) {
            toast.error("Board name is required");
            return;
        }

        try {
            setLoading(true);
            const success = await onSave(projectName, projectDescription, selectedUsers);
            if (!success) {
                throw new Error("Failed to create board");
            }
        } catch (error) {
            toast.error('Failed to create board');
        } finally {
            setLoading(false);
            onOpenChange(false);
            setProjectName("");
            setProjectDescription("");
            setSelectedUsers([]);
        }
    }

    useEffect(() => {
        if (open) {
            fetchUsers().catch(() => {
                toast.error('Failed to fetch users');
            });
        }
    }, [open, fetchUsers]);

    if (loading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent showCloseButton={false} className="gap-5">
                    <DialogTitle className="text-center">Create New Board</DialogTitle>
                    <div className="flex items-center justify-center h-40">
                        <Loader />
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="text-center">Create New Board</DialogTitle>
                    <DialogDescription className="text-center">Create new board for your project and assign tasks to team members</DialogDescription>
                </DialogHeader>
                <div>
                    <Label htmlFor="board-name">Board Name *</Label>
                    <Input 
                    id="board-name" 
                    value={projectName} 
                    onChange={(e) => setProjectName(e.target.value)} 
                    placeholder="e.g. Project Alpha" 
                    className="mt-2" 
                    />
                </div>
                <div>
                    <Label htmlFor="board-description">Board Description</Label>
                    <Input 
                    id="board-description" 
                    value={projectDescription} 
                    onChange={(e) => setProjectDescription(e.target.value)} 
                    placeholder="e.g. Project Alpha Description" 
                    className="mt-2" 
                    />
                </div>
                <div>
                    <Label htmlFor="board-members">Add Members</Label>
                    <Select onValueChange={handleUserSelect}>
                        <SelectTrigger className="mt-2 w-full">
                            <SelectValue placeholder={usersLoading ? "Loading users..." : "Select team members..."} />
                        </SelectTrigger>
                        <SelectContent>
                            {usersLoading ? (
                                <SelectItem value="loading" disabled>Loading...</SelectItem>
                            ) : users.length > 0 ? (
                                users
                                    .filter(u => !selectedUsers.includes(u.id.toString()) && (user == null || u.email !== user.email))
                                    .map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.username} ({user.email})
                                        </SelectItem>
                                    ))
                            ) : (
                                <SelectItem value="no-users" disabled>No users found</SelectItem>
                            )}
                        </SelectContent>
                    </Select>

                    {selectedUsers.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {selectedUsers.map((userId) => {
                                const user = getUserById(userId);
                                return user ? (
                                    <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                                        {user.username}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 hover:bg-transparent"
                                            onClick={() => removeUser(userId)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ) : null;
                            })}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button className="hover:cursor-pointer"variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="dark"
                        onClick={handleSave}
                    >
                        Create Board
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}