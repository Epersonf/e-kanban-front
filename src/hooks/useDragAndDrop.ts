// hooks/useDragAndDrop.ts
import { useCallback } from 'react';
import { OnDragEndResponder } from 'react-beautiful-dnd';
import { Board } from '../models/general/board.model';
import { Swimlane } from '../models/general/swimlane.model';
import { useBoardsStore } from '../stores/boards/boards.store';
import { Task } from '../models/general/task.model';


export const useDragAndDrop = (
  board: Board,
) => {
  const boardStore = useBoardsStore();
  const onDragEnd: OnDragEndResponder = useCallback(async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (!destination) return;

    const taskId = draggableId;
    const taskExists = board
      .getSwimlanes()
      .flatMap((s: Swimlane) => s.getTasks())
      .some((t: Task) => t.id === taskId);
    console.log('Task exists:', taskExists, 'Task ID:', taskId);

    await boardStore.moveTask(
      taskId,
      source.droppableId,
      source.index,
      destination.droppableId,
      destination.index
    );
  }, []);

  return { onDragEnd };
};