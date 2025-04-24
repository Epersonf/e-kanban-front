import React, { useState } from 'react';
import Card, { CardType } from './Card';
import CardDetailsModal from './CardDetailsModal';

export interface ListType {
  id: number;
  title: string;
  cards: CardType[];
}

interface ListProps {
  list: ListType;
  onCardDelete: (cardId: number) => void;
  onCardDragStart: (card: CardType, fromListId: number) => void;
  isDragOver: boolean;
  onCardUpdate?: (cardId: number, updated: CardType) => void;
  onListTitleChange?: (newTitle: string) => void;
  onListDelete?: () => void;
}

const List: React.FC<ListProps> = ({
  list,
  onCardDelete,
  onCardDragStart,
  isDragOver,
  onCardUpdate,
  onListTitleChange,
  onListDelete
}) => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(list.title);

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => setSelectedCard(null);

  const handleSaveCard = (updated: CardType) => {
    if (onCardUpdate) {
      onCardUpdate(updated.id, updated);
    }
    setSelectedCard(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSaveTitle = () => {
    if (onListTitleChange && editingTitle.trim() !== list.title) {
      onListTitleChange(editingTitle.trim())
    }
    setIsEditingTitle(false)
  }


  return (
    <div
      style={{
        background: isDragOver ? '#cbe0f6' : '#162447',
        color: '#e0e0e0',
        borderRadius: 6,
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 100,
        transition: 'background 0.2s',
      }}
      onDragOver={handleDragOver}
    >
      <div style={{ fontWeight: 'bold', marginBottom: 12, color: '#fff' }}>{list.title}</div>
      {list.cards.map(card => (
        <Card
          key={card.id}
          card={card}
          onDelete={() => onCardDelete(card.id)}
          onClick={() => handleCardClick(card)}
          draggableProps={{
            draggable: true,
            onDragStart: (e: React.DragEvent) => {
              e.dataTransfer.setData('application/json', JSON.stringify({ card, fromListId: list.id }));
              onCardDragStart(card, list.id);
            },
          }}
        />
      ))}
      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={handleCloseModal}
          onSave={handleSaveCard}
        />
      )}
    </div>
  );
};

export default List;
