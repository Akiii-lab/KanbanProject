import { useDroppable } from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PlusIcon, MoreHorizontal } from 'lucide-react';
import { DraggableTask } from '../DraggableTask/DraggableTask';
import { Task } from '@/types/task';

interface DroppableColumnProps {
    id: string;
    title: string;
    color: string;
    tasks: Task[];
    count: number;
    onTaskClick: (task: Task) => void;
}

export function DroppableColumn({ id, title, color, tasks, count, onTaskClick }: DroppableColumnProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    const style = {
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : undefined,
    };

    return (
        <div className="flex flex-col h-full">
            <Card className="p-2 w-sm">
                <CardContent>
                    <div className="flex flex-col justify-between items-start gap-2">
                        <span className="font-bold text-lg text-chart-2">{title}</span>
                        <div className="flex flex-row justify-between items-center w-full">
                            <span className="font-bold text-2xl">{count}</span>
                            <span 
                                className="inline-block w-4 h-4 rounded-full mr-2 opacity-40"
                                style={{ backgroundColor: color }}
                            ></span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="flex flex-row justify-between items-center p-4">
                <Label className="font-bold text-lg">{title}</Label>
                <div className="flex flex-row gap-2">
                    <PlusIcon />
                    <MoreHorizontal />
                </div>
            </div>
            <Card 
                ref={setNodeRef}
                style={style}
                className="bg-background border-dashed border border-chart-2 flex-1 overflow-y-auto transition-colors duration-200"
            >
                <CardContent className="gap-4 flex flex-col">
                    {tasks.map((task) => (
                        <DraggableTask 
                            key={task.id} 
                            task={task} 
                            columnColor={color}
                            onTaskClick={onTaskClick}
                        />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}