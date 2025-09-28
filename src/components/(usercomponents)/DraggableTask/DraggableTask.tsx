import { useDraggable } from '@dnd-kit/core';
import { Card, CardHeader } from '@/components/ui/card';
import { Task } from '@/types/task';

interface DraggableTaskProps {
    task: Task;
    columnColor: string;
}

export function DraggableTask({ task, columnColor }: DraggableTaskProps) {
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

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    return (
        <Card 
            ref={setNodeRef} 
            style={style}
            {...listeners}
            {...attributes}
            className={`p-2 bg-background hover:border hover:border-[${columnColor}] hover:cursor-pointer transition-all duration-200 ${
                isDragging ? 'z-50 shadow-lg' : ''
            }`}
        >
            <CardHeader>
                {task.title}
            </CardHeader>
        </Card>
    );
}