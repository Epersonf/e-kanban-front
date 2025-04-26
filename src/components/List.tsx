import React, { useEffect, useState } from 'react';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { Swimlane } from '../models/general/swimlane.model'; // Ajuste no path relativo
import { Task } from '../models/general/task.model'; // Ajuste no path relativo

interface ListProps {
  list: Swimlane;
  onListDelete: (listId: string) => void;
  onListTitleChange: (newTitle: string) => void;
  // onCardUpdate não é mais necessária aqui se for gerenciada centralmente
  renderCard: (task: Task, index: number) => React.ReactNode; // << Atualizado para receber index
  // ... (outras props, se houver) ...
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

      {/* Container dos Cards - Agora é um Droppable */}
      <Droppable droppableId={list.id!} type="CARD">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              padding: '0 8px',
              minHeight: '50px', // Aumentar um pouco para melhor área de drop
              background: snapshot.isDraggingOver ? '#e0f2f7' : 'transparent', // Feedback visual
              transition: 'background-color 0.2s ease',
              borderRadius: '4px',
            }}
          >
            {list.getTasks()
              // .sort(/* Se precisar de ordenação específica de tasks aqui */) // Ordenação deve vir da store ou API
              .map((task, index) => (
                 // Chama a função renderCard passada por BoardDetail, agora com index
                 renderCard(task, index) // Passa o index necessário para o Draggable Card
              ))}
            {provided.placeholder} {/* Placeholder é essencial */}
          </div>
        )}
      </Droppable>
    </div>
  );
};
