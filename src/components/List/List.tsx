import React, { memo, useEffect, useState } from 'react';
import { Draggable, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { Swimlane } from '../../models/general/swimlane.model';
import { Task } from '../../models/general/task.model';

import {
  ListWrapper,
  ListHeader,
  ListTitle,
  ListTitleInput,
  DeleteListButton,
  CardDropArea
} from './List.styles';

interface ListProps {
  list: Swimlane;
  onListDelete: (listId: string) => void;
  onListTitleChange: (listId: string, newTitle: string) => void;
  renderCard: (task: Task, index: number, provided: any) => React.ReactNode;
}

export const List: React.FC<ListProps> = memo(({
  list,
  onListDelete,
  onListTitleChange,
  renderCard,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(list.getName());

  useEffect(() => {
    setCurrentTitle(list.getName());
  }, [list.getName()]); // Atualiza se o nome da lista mudar externamente

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    const trimmedTitle = currentTitle.trim();
    if (trimmedTitle && trimmedTitle !== list.getName()) {
      // Passa o ID da lista junto com o novo título
      onListTitleChange(list.id!, trimmedTitle);
    } else {
      setCurrentTitle(list.getName()); // Reverte se vazio ou inalterado
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setCurrentTitle(list.getName());
      setIsEditingTitle(false);
    }
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleDeleteClick = () => {
    onListDelete(list.id!);
  };

  return (
    // Use ListWrapper como container principal
    <ListWrapper>
      {/* Use ListHeader para o cabeçalho */}
      <ListHeader>
        {isEditingTitle ? (
          // Use ListTitleInput para edição
          <ListTitleInput
            type="text"
            value={currentTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            autoFocus
          />
        ) : (
          // Use ListTitle para exibição
          <ListTitle onClick={handleTitleClick}>
            {list.getName()}
          </ListTitle>
        )}
        {/* Use DeleteListButton */}
        <DeleteListButton onClick={handleDeleteClick} title="Excluir lista">
          ✕
        </DeleteListButton>
      </ListHeader>

      {/* Container dos Cards - Droppable */}
      <Droppable droppableId={list.id!} type="CARD">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <CardDropArea
            ref={provided.innerRef}
            {...provided.droppableProps}
            $isDraggingOver={snapshot.isDraggingOver} // Passa o estado para o styled-component
          >
            {list.getTasks().map((task, index) => (
              <Draggable key={task.id} draggableId={task.id!} index={index}>
                {(providedDraggable) => (
                  <div
                    ref={providedDraggable.innerRef}
                    {...providedDraggable.draggableProps}
                    {...providedDraggable.dragHandleProps}
                  >
                    {renderCard(task, index, providedDraggable)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder} {/* Essencial para o Droppable */}
          </CardDropArea>
        )}
      </Droppable>
    </ListWrapper>
  );
});