
import { Task } from '@/services/api';
import { TaskCard } from './TaskCard';
import { Droppable } from '@hello-pangea/dnd';

interface BoardColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  count: number;
}

export const BoardColumn = ({ title, status, tasks, count }: BoardColumnProps) => {
  const getColumnColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 border-blue-200';
      case 'done':
        return 'bg-green-100 border-green-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className={`flex-1 min-w-80 rounded-lg border-2 ${getColumnColor(status)} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
        <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600">
          {count}
        </span>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 max-h-96 overflow-y-auto min-h-20 rounded-lg p-2 transition-colors ${
              snapshot.isDraggingOver ? 'bg-white/50' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center py-8 text-gray-500">
                <p>No tasks yet</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
