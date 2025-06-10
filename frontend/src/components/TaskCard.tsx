
import { Task } from '@/services/api';
import { Draggable } from '@hello-pangea/dnd';

interface TaskCardProps {
  task: Task;
  index: number;
}

export const TaskCard = ({ task, index }: TaskCardProps) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'border-l-gray-400 bg-gray-50';
      case 'in-progress':
        return 'border-l-blue-500 bg-blue-50';
      case 'done':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 bg-white rounded-lg shadow-sm border-l-4 ${getStatusColor(task.status)} hover:shadow-md transition-shadow cursor-grab mb-3 ${
            snapshot.isDragging ? 'shadow-lg rotate-2' : ''
          }`}
        >
          <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="capitalize bg-gray-100 px-2 py-1 rounded">
              {task.status.replace('-', ' ')}
            </span>
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
};
