import { useDraggable } from '@dnd-kit/core';
import { Card, CardHeader } from '@/components/ui/card';
import { Task } from '@/types/task';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraggableTaskProps {
    task: Task;
    columnColor: string;
    onTaskClick: (task: Task) => void;
}

export function DraggableTask({ task, columnColor, onTaskClick }: DraggableTaskProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: task.id.toString(),
        data: {
            task,
        },
    });

    const [hovered, setHovered] = useState(false);

    const handleEyeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onTaskClick(task);
    };

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        borderColor: hovered ? columnColor : undefined,
        borderWidth: hovered ? 2 : undefined,
        borderStyle: hovered ? 'solid' : undefined,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`p-2 bg-background hover:cursor-pointer transition-all duration-200 ${isDragging ? 'z-50 shadow-lg' : ''
                }`}
        >
            <CardHeader className="p-0 flex flex-row justify-between items-center">
                <span 
                    {...listeners}
                    {...attributes}
                    className="flex-1 cursor-grab"
                >
                    {task.title}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEyeClick}
                    className="p-1 h-6 w-6 hover:bg-gray-200 transition-opacity cursor-pointer"
                    style={{ opacity: hovered ? 1 : 0 }}
                >
                    <Eye size={12} />
                </Button>
            </CardHeader>
        </Card>
    );
}