import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Board } from '../../models/general/board.model';
import { Task } from '../../models/general/task.model';
import { User } from '../../models/general/user.model';
import { BoardContent } from './BorderDetail.styles';
import { BoardHeader } from '../BoardHeader/BoardHeader';
import { TasksApi, UpdateTaskPayload } from '../../infra/api/tasks.api';
import { runInAction } from 'mobx';
import { ListContainer } from '../ListContainer';
import TaskModal, { SwimLaneOption } from '../TaskModal/TaskModal';

interface BoardDetailProps {
  board: Board;
  onUpdateBoardTitle: (boardId: string, newTitle: string, description?: string) => void;
  onDeleteBoard: (boardIds: string[]) => void;
  // onAddList: (boardId: string, name: string, order: number) => Promise<void>;
  // onUpdateListTitle: (listId: string, newTitle: string, boardId: string, order: number) => void;
  // onDeleteList: (listId: string) => void;
  // onAddCard: (listId: string, data: { title: string; description: string }) => void;
  // onUpdateCard: (
  //   cardId: string,
  //   listId: string,
  //   data: { name?: string; description?: string; ownerIds?: string[] }
  // ) => void;
  // onDeleteCard: (cardId: string, listId: string) => void;
}

export const BoardDetail: React.FC<BoardDetailProps> = observer(
  ({
    board,
    onUpdateBoardTitle,
    onDeleteBoard,
    // onAddList,
    // onUpdateListTitle,
    // onDeleteList,
    // onAddCard,
    // onUpdateCard,
    // onDeleteCard,
  }) => {
    // State
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editingTitle, setEditingTitle] = useState(board.getName());
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [targetSwimlaneId, setTargetSwimlaneId] = useState<string | null>(null);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    // Memoização
    const boardMembers = board.getMembers();
    const membersMap = useMemo(() => {
      const map = new Map<string, User>();
      boardMembers.forEach((member) => map.set(member.id!, member));
      return map;
    }, [boardMembers]);

    // Effects
    useEffect(() => {
      setEditingTitle(board.getName());
    }, [board]);

    // Handlers
    const handleSaveBoardTitle = useCallback(() => {
      if (!editingTitle.trim() || editingTitle.trim() === board.getName()) {
        setIsEditingTitle(false);
        return;
      }
      onUpdateBoardTitle(board.id!, editingTitle.trim(), board.getDescription());
      setIsEditingTitle(false);
    }, [board, editingTitle, onUpdateBoardTitle]);

    const handleDeleteBoardClick = useCallback(() => {
      if (window.confirm(`Tem certeza que deseja excluir o board "${board.getName()}"?`)) {
        onDeleteBoard([board.id!]);
      }
    }, [board, onDeleteBoard]);

    // Handlers for Task Modal
    const handleOpenTaskModal = useCallback((swimlaneId: string, task?: Task) => {
      setTargetSwimlaneId(swimlaneId);
      if (task) {
        setTaskToEdit(task);
      } else {
        setTaskToEdit(null);
      }
      setShowTaskModal(true);
    }, []);

    const handleCloseTaskModal = useCallback(() => {
      setShowTaskModal(false);
      setTargetSwimlaneId(null);
      setTaskToEdit(null);
    }, []);

    const handleSaveCardDetails = useCallback(
      async (cardId: string, updates: { name?: string; description?: string; ownerIds?: string[] }) => {
        const originalCard = board
          .getSwimlanes()
          .flatMap((l) => l.getTasks())
          .find((t) => t.id === cardId);
        if (!originalCard) return;

        const payload: UpdateTaskPayload = {
          id: cardId,
          name: updates.name,
          description: updates.description,
          swimlaneId: originalCard.getSwimlaneId(),
        };
        const result = await TasksApi.updateTask(payload);
        if (result.isError()) {
          console.error('Falha ao atualizar tarefa:', result.getError());
        } else {
          runInAction(() => {
            if (updates.name) originalCard.setName(updates.name);
            if (updates.description) originalCard.setDescription(updates.description);
            if (updates.ownerIds) originalCard.setOwnerIds(updates.ownerIds);
          });
        }
        handleCloseTaskModal();
      },
      [board, handleCloseTaskModal]
    );

    // Convert swimlanes to options for the task modal
    const swimlaneOptions: SwimLaneOption[] = useMemo(() => {
      return board.getSwimlanes().map(swimlane => ({
        id: swimlane.id!,
        name: swimlane.getName()
      }));
    }, [board]);

    return (
      <BoardContent>
        <BoardHeader
          board={board}
          isEditingTitle={isEditingTitle}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          setIsEditingTitle={setIsEditingTitle}
          handleSaveBoardTitle={handleSaveBoardTitle}
          handleDeleteBoardClick={handleDeleteBoardClick}
        />
        <ListContainer
          board={board}
          onOpenTaskModal={handleOpenTaskModal}
        />

        {/* Task Modal for creating and editing tasks */}
        <TaskModal
          isOpen={showTaskModal}
          onClose={handleCloseTaskModal}
          swimlanes={swimlaneOptions}
          taskToEdit={{
            id: taskToEdit?.id || '',
            name: taskToEdit?.getName() || '',
            description: taskToEdit?.getDescription() || '',
            swimlaneId: taskToEdit?.getSwimlaneId() || '',
          }}
        />
      </BoardContent>
    );
  }
);