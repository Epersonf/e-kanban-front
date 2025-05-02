// components/ListsContainer.tsx
import React, { JSX, useCallback } from 'react';
import { Board } from '../../models/general/board.model';
import { Task } from '../../models/general/task.model';
import { ListsContainer, ListWrapper, AddCardButton } from '../../components/BoardDetail/BorderDetail.styles';
import { List } from '../List/List';
import AddListButton from '../../components/AddListButton/AddListButton';

interface ListsContainerProps {
  board: Board;
  onAddList: (boardId: string, name: string, order: number) => Promise<void>;
  onUpdateListTitle: (listId: string, newTitle: string, boardId: string, order: number) => void;
  onDeleteList: (listId: string) => void;
  onDeleteCard: (cardId: string, listId: string) => void;
  handleOpenAddCardModal: (listId: string) => void;
  renderCardCallback: (task: Task, index: number, provided: any) => JSX.Element;
}

export const ListsContainerComponent: React.FC<ListsContainerProps> = ({
  board,
  onAddList,
  onUpdateListTitle,
  onDeleteList,
  onDeleteCard,
  handleOpenAddCardModal,
  renderCardCallback,
}) => {
  const handleAddListClick = useCallback(async () => {
    const name = prompt('Nome da nova lista:') || '';
    if (!name.trim()) return;
    const nextOrder =
      board.getSwimlanes().length > 0
        ? Math.max(...board.getSwimlanes().map((l) => l.order)) + 1
        : 0;
    await onAddList(board.id!, name.trim(), nextOrder);
  }, [board, onAddList]);

  return (
    <ListsContainer>
      {board
        .getSwimlanes()
        .sort((a, b) => a.order - b.order)
        .map((list) => (
          <ListWrapper key={list.id}>
            <List
              list={list}
              onListDelete={() => {
                if (window.confirm(`Excluir a lista "${list.getName()}" e todos os seus cartões?`)) {
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
  );
};