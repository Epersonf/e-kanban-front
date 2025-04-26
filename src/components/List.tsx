// src/components/List/List.tsx (Esboço da modificação)

import React, { useEffect, useState } from 'react';
import { Swimlane } from '../models/general/swimlane.model';
import { Task } from '../models/general/task.model';
// import Card from '../Card'; // Não importa mais Card diretamente

interface ListProps {
  list: Swimlane;
  onListDelete: (listId: string) => void;
  onListTitleChange: (newTitle: string) => void;
  onCardUpdate: (cardId: string, listId: string, updatedData: { title?: string; description?: string }) => void; // Prop repassada
  renderCard: (task: Task, draggableProps?: any) => React.ReactNode; // << Nova prop
  // ... (props de D&D: onCardDragStart, isDragOver) ...
}

export const List: React.FC<ListProps> = ({
  list,
  onListDelete,
  onListTitleChange,
  renderCard, // <-- Usar a nova prop
  // ... outras props
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(list.getName());

  useEffect(() => {
    setCurrentTitle(list.getName());
  }, [list]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (currentTitle.trim() && currentTitle !== list.getName()) {
      onListTitleChange(currentTitle.trim());
    } else {
        setCurrentTitle(list.getName()); // Reverte se vazio ou igual
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setCurrentTitle(list.getName());
      setIsEditingTitle(false);
    }
  };


  return (
    <div /* Estilo do container da Lista */>
      <div /* Cabeçalho da Lista (Título e botão delete) */ style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
        {isEditingTitle ? (
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            style={{ /* Estilo do input de título */ }}
          />
        ) : (
          <h3 onClick={() => setIsEditingTitle(true)} style={{ /* Estilo do título */ cursor: 'pointer', margin: 0, flexGrow: 1 }}>
             {list.getName()}
          </h3>
        )}
        <button onClick={() => onListDelete(list.id!)} style={{ /* Estilo botão delete lista */ }}>
          ✕
        </button>
      </div>

      {/* Container dos Cards (será o Droppable do react-beautiful-dnd) */}
      <div /* Estilo do container de cards */ style={{ padding: '0 8px', minHeight: '20px' /* para área de drop */ }}>
        {list.getTasks()
          .sort(/* Se precisar de ordenação específica de tasks aqui */)
          .map((task, index) => (
             // Chama a função renderCard passada por BoardDetail
             // O segundo argumento seria as props do Draggable (vindo de react-beautiful-dnd)
             renderCard(task /*, draggableProvided.draggableProps, draggableProvided.dragHandleProps */)
          ))}
        {/* Placeholder do Droppable (vindo de react-beautiful-dnd) */}
      </div>
    </div>
  );
};