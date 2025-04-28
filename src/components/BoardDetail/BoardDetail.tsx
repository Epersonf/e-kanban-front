import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { DragDropContext } from 'react-beautiful-dnd';
import { Board } from '../../models/general/board.model';
import { Task } from '../../models/general/task.model';
import { User } from '../../models/general/user.model';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { BoardContent } from './BorderDetail.styles';
import { BoardHeader } from '../BoardHeader/BoardHeader';
import { ListsContainerComponent } from '../ListsContainerComponent/ListsContainerComponent';
import AddCardModal from '../../components/AddCardModal/AddCardModal';
import CardDetailsModal from '../CardDetailsModal/CardDetailsModal';
import Card from '../../components/Card/Card';
import { TasksApi, UpdateTaskPayload } from '../../infra/api/tasks.api';
import { runInAction } from 'mobx';

interface BoardDetailProps {
  board: Board;
  onUpdateBoardTitle: (boardId: string, newTitle: string, description?: string) => void;
  onDeleteBoard: (boardIds: string[]) => void;
  onAddList: (boardId: string, name: string, order: number) => Promise<void>;
  onUpdateListTitle: (listId: string, newTitle: string, boardId: string, order: number) => void;
  onDeleteList: (listId: string) => void;
  onAddCard: (listId: string, data: { title: string; description: string }) => void;
  onUpdateCard: (
    cardId: string,
    listId: string,
    data: { name?: string; description?: string; ownerIds?: string[] }
  ) => void;
  onDeleteCard: (cardId: string, listId: string) => void;
}

export const BoardDetail: React.FC<BoardDetailProps> = observer(
  ({
    board,
    onUpdateBoardTitle,
    onDeleteBoard,
    onAddList,
    onUpdateListTitle,
    onDeleteList,
    onAddCard,
    onUpdateCard,
    onDeleteCard,
  }) => {
    // State
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editingTitle, setEditingTitle] = useState(board.getName());
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [targetListId, setTargetListId] = useState<string | null>(null);
    const [editingCard, setEditingCard] = useState<Task | null>(null);
    const [isCardDetailsModalOpen, setIsCardDetailsModalOpen] = useState(false);

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
    }, [board.getName()]);

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

    const handleOpenAddCardModal = useCallback((listId: string) => {
      setTargetListId(listId);
      setShowAddCardModal(true);
    }, []);

    const handleAddCardSubmit = useCallback(
      (data: { title: string; description: string }) => {
        if (!targetListId) return;
        onAddCard(targetListId, data);
        setShowAddCardModal(false);
        setTargetListId(null);
      },
      [targetListId, onAddCard]
    );

    const handleOpenCardDetailsModal = useCallback((task: Task) => {
      setEditingCard(task);
      setIsCardDetailsModalOpen(true);
    }, []);

    const handleCloseCardDetailsModal = useCallback(() => {
      setIsCardDetailsModalOpen(false);
      setEditingCard(null);
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
        handleCloseCardDetailsModal();
      },
      [board, handleCloseCardDetailsModal]
    );

    const renderCardCallback = useCallback(
      (task: Task, index: number, provided: any) => {
        const ownerIds = task.getOwnerIds() || [];
        const taskOwners = ownerIds
          .map((id) => membersMap.get(id))
          .filter((user): user is User => Boolean(user));

        return (
          <Card
            key={task.id}
            card={task}
            owners={taskOwners}
            onDelete={() => {
              if (window.confirm(`Excluir o cartão "${task.getName()}"?`)) {
                onDeleteCard(task.id!, task.getSwimlaneId());
              }
            }}
            onClick={() => handleOpenCardDetailsModal(task)}
            draggableProps={provided.draggableProps}
            dragHandleProps={provided.dragHandleProps}
            innerRef={provided.innerRef}
          />
        );
      },
      [membersMap, onDeleteCard, handleOpenCardDetailsModal]
    );

    const { onDragEnd } = useDragAndDrop(board);

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
        <DragDropContext onDragEnd={onDragEnd}>
          <ListsContainerComponent
            board={board}
            onAddList={onAddList}
            onUpdateListTitle={onUpdateListTitle}
            onDeleteList={onDeleteList}
            onDeleteCard={onDeleteCard}
            handleOpenAddCardModal={handleOpenAddCardModal}
            renderCardCallback={renderCardCallback}
          />
        </DragDropContext>

        <AddCardModal
          isOpen={showAddCardModal}
          onClose={() => {
            setShowAddCardModal(false);
            setTargetListId(null);
          }}
          onAdd={handleAddCardSubmit}
        />

        {isCardDetailsModalOpen && editingCard && (
          <CardDetailsModal
            isOpen={isCardDetailsModalOpen}
            card={editingCard}
            boardMembers={boardMembers}
            onClose={handleCloseCardDetailsModal}
            onSave={handleSaveCardDetails}
          />
        )}
      </BoardContent>
    );
  }
);