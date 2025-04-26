import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { DragDropContext, OnDragEndResponder, Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { Board } from '../../models/general/board.model';
import { Swimlane } from '../../models/general/swimlane.model';
import { Task } from '../../models/general/task.model';
import { User } from '../../models/general/user.model';
import AddListButton from '../AddListButton';
import AddCardModal from '../AddCardModal';
import Card from '../Card';
import CardDetailsModal from '../CardDetailsModal';
import { FiEdit } from 'react-icons/fi';
import {
  BoardContent,
  BoardTitleArea,
  BoardTitle,
  TitleInput,
  EditButton,
  DeleteButton,
  ListsContainer,
  ListWrapper,
  AddCardButton,
} from './styles';
import { List } from '../List';

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
    // --- State ---
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editingTitle, setEditingTitle] = useState('');
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [targetListId, setTargetListId] = useState<string | null>(null);
    const [editingCard, setEditingCard] = useState<Task | null>(null);
    const [isCardDetailsModalOpen, setIsCardDetailsModalOpen] = useState(false);

    // --- Memoização ---
    const boardMembers = board.getMembers();
    const membersMap = useMemo(() => {
      const map = new Map<string, User>();
      boardMembers.forEach((member) => map.set(member.id!, member));
      return map;
    }, [boardMembers]);

    // --- Effects ---
    useEffect(() => {
      setEditingTitle(board.getName());
      setIsEditingTitle(false);
    }, [board]);

    // --- Handlers ---
    const handleSaveBoardTitle = useCallback(() => {
      if (!editingTitle.trim() || editingTitle.trim() === board.getName()) {
        setIsEditingTitle(false);
        setEditingTitle(board.getName());
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

    const handleAddListClick = useCallback(async () => {
      const name = prompt('Nome da nova lista:') || '';
      if (!name.trim()) return;
      const nextOrder =
        board.getSwimlanes().length > 0
          ? Math.max(...board.getSwimlanes().map((l) => l.order)) + 1
          : 0;
      await onAddList(board.id!, name.trim(), nextOrder);
    }, [board, onAddList]);

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
        onUpdateCard('', targetListId, { name: data.title, description: data.description });
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
      (
        cardId: string,
        updates: { name?: string; description?: string; ownerIds?: string[] }
      ) => {
        const originalCard = board
          .getSwimlanes()
          .flatMap((l) => l.getTasks())
          .find((t) => t.id === cardId);

        if (!originalCard) return;

        onUpdateCard(cardId, originalCard.getSwimlaneId(), updates);
        handleCloseCardDetailsModal();
      },
      [board, onUpdateCard, handleCloseCardDetailsModal]
    );

    // --- Drag and Drop Logic ---
    const onDragEnd: OnDragEndResponder = useCallback(
      (result) => {
        const { source, destination } = result;

        // Se não houver destino (soltou fora de um droppable), não faça nada
        if (!destination) {
          return;
        }

        const sourceSwimlane = board.getSwimlanes().find((s) => s.id === source.droppableId);
        const destSwimlane = board.getSwimlanes().find((s) => s.id === destination.droppableId);

        if (!sourceSwimlane || !destSwimlane) {
          return;
        }

        // Clonar as tarefas para evitar mutações diretas
        const sourceTasks = [...sourceSwimlane.getTasks()];
        const destTasks = [...destSwimlane.getTasks()];

        // Remover a tarefa da origem
        const [movedTask] = sourceTasks.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
          // Reordenar dentro da mesma swimlane
          sourceTasks.splice(destination.index, 0, movedTask);
          sourceSwimlane.setTasks(sourceTasks);
        } else {
          // Mover para outra swimlane
          destTasks.splice(destination.index, 0, movedTask);
          sourceSwimlane.setTasks(sourceTasks);
          destSwimlane.setTasks(destTasks);
          // Atualizar o swimlaneId da tarefa movida
          movedTask.setSwimlaneId(destination.droppableId);
          // Chamar onUpdateCard para persistir a mudança de swimlane
          onUpdateCard(movedTask.id!, destination.droppableId, {
            name: movedTask.getName(),
            description: movedTask.getDescription(),
            ownerIds: movedTask.getOwnerIds(),
          });
        }
      },
      [board, onUpdateCard]
    );

    // --- Render Function for Cards ---
    const renderCardCallback = useCallback(
      (task: Task, index: number) => {
        const ownerIds = task.getOwnerIds() || [];
        const taskOwners = ownerIds
          .map((id) => membersMap.get(id))
          .filter((user): user is User => !!user);

        return (
          <Draggable key={task.id} draggableId={task.id!} index={index}>
            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                  ...provided.draggableProps.style,
                  margin: '4px 0',
                  background: snapshot.isDragging ? '#f0f0f0' : 'white',
                }}
              >
                <Card
                  card={task}
                  owners={taskOwners}
                  onDelete={() => {
                    if (window.confirm(`Excluir o cartão "${task.getName()}"?`)) {
                      onDeleteCard(task.id!, task.getSwimlaneId());
                    }
                  }}
                  onClick={() => handleOpenCardDetailsModal(task)}
                />
              </div>
            )}
          </Draggable>
        );
      },
      [membersMap, onDeleteCard, handleOpenCardDetailsModal]
    );

    // --- JSX ---
    return (
      <BoardContent>
        <BoardTitleArea>
          {isEditingTitle ? (
            <TitleInput
              value={editingTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
              onBlur={handleSaveBoardTitle}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') handleSaveBoardTitle();
                if (e.key === 'Escape') {
                  setEditingTitle(board.getName());
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
            />
          ) : (
            <BoardTitle>{board.getName()}</BoardTitle>
          )}
          <EditButton onClick={() => setIsEditingTitle(true)}>
            <FiEdit />
          </EditButton>
          <DeleteButton onClick={handleDeleteBoardClick}>Excluir</DeleteButton>
        </BoardTitleArea>

        <DragDropContext onDragEnd={onDragEnd}>
          <ListsContainer>
            {board
              .getSwimlanes()
              .sort((a, b) => a.order - b.order)
              .map((list) => (
                <ListWrapper key={list.id}>
                  <List
                    list={list}
                    onListDelete={() => {
                      if (
                        window.confirm(
                          `Excluir a lista "${list.getName()}" e todos os seus cartões?`
                        )
                      ) {
                        onDeleteList(list.id!);
                      }
                    }}
                    onListTitleChange={(newTitle) =>
                      onUpdateListTitle(list.id!, newTitle, board.id!, list.order)
                    }
                    renderCard={renderCardCallback}
                  />
                  <AddCardButton onClick={() => handleOpenAddCardModal(list.id!)}>
                    + Adicionar cartão
                  </AddCardButton>
                </ListWrapper>
              ))}
            <AddListButton onClick={handleAddListClick} />
          </ListsContainer>
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