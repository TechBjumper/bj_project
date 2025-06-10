
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, fetchBoards, Task } from '@/services/api';
import { BoardColumn } from './BoardColumn';
import { Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

export const KanbanBoard = () => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>('1');
  const queryClient = useQueryClient();

  const { data: boards, isLoading: boardsLoading, error: boardsError } = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
  });

  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  if (boardsLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your boards and tasks...</p>
        </div>
      </div>
    );
  }

  if (boardsError || tasksError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Error loading data. Please try again.</p>
        </div>
      </div>
    );
  }

  const currentBoard = boards?.find(board => board.id === selectedBoardId);
  const boardTasks = tasks?.filter(task => task.boardId === selectedBoardId) || [];

  const todoTasks = boardTasks.filter(task => task.status === 'todo');
  const inProgressTasks = boardTasks.filter(task => task.status === 'in-progress');
  const doneTasks = boardTasks.filter(task => task.status === 'done');

  const handleDragEnd = (result: DropResult) => {
    console.log('Drag ended:', result);
    
    const { destination, source, draggableId } = result;

    // If there's no destination, do nothing
    if (!destination) {
      return;
    }

    // If the item is dropped in the same position, do nothing
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Update the task status optimistically
    const newStatus = destination.droppableId as Task['status'];
    
    // Update the local cache immediately for better UX
    queryClient.setQueryData(['tasks'], (oldTasks: Task[] | undefined) => {
      if (!oldTasks) return oldTasks;
      
      return oldTasks.map(task => 
        task.id === draggableId 
          ? { ...task, status: newStatus }
          : task
      );
    });

    console.log(`Task ${draggableId} status updated to ${newStatus}`);
    
    // TODO: In a real app, you would make an API call here:
    // updateTaskStatus(draggableId, newStatus);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
              <p className="text-gray-600">Manage your projects and tasks</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedBoardId}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {boards?.map(board => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Board Info */}
      {currentBoard && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentBoard.name}</h2>
            {currentBoard.description && (
              <p className="text-gray-600">{currentBoard.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            <BoardColumn
              title="To Do"
              status="todo"
              tasks={todoTasks}
              count={todoTasks.length}
            />
            <BoardColumn
              title="In Progress"
              status="in-progress"
              tasks={inProgressTasks}
              count={inProgressTasks.length}
            />
            <BoardColumn
              title="Done"
              status="done"
              tasks={doneTasks}
              count={doneTasks.length}
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};
