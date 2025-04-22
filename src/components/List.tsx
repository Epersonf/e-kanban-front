import React from 'react';
import Card, { CardType } from './Card';

export interface ListType {
  id: number;
  title: string;
  cards: CardType[];
}

interface ListProps {
  list: ListType;
  onCardDelete: (cardId: number) => void;
  // onCardDrop removed - handled by parent
  onCardDragStart: (card: CardType, fromListId: number) => void;
  isDragOver: boolean; // Keep this for visual feedback
}

const List: React.FC<ListProps> = ({ list, onCardDelete, onCardDragStart, isDragOver }) => {

  // handleDragOver might still be useful if you want specific behavior *over* the list itself,
  // but the main drop logic is now in the parent.
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
  };

  // handleDrop removed - handled by parent

  return (
    <div
      style={{
        // Use isDragOver from props for background change
        background: isDragOver ? '#cbe0f6' : '#162447', // Adjusted background for dark theme
        color: '#e0e0e0', // Text color for dark theme
        borderRadius: 6,
        padding: '12px 16px',
        // width: 270, // Let parent div control width
        // marginRight: 16, // Let parent gap control spacing
        display: 'flex',
        flexDirection: 'column',
        minHeight: 100,
        transition: 'background 0.2s',
        // Remove box shadow if parent handles background
      }}
      // onDrop removed
      onDragOver={handleDragOver} // Keep allowing drag over
    >
      <div style={{ fontWeight: 'bold', marginBottom: 12, color: '#fff' }}>{list.title}</div>
      {list.cards.map(card => (
        <Card
          key={card.id}
          card={card}
          onDelete={() => onCardDelete(card.id)}
          draggableProps={{
            draggable: true,
            onDragStart: (e: React.DragEvent) => {
              // Pass JSON string for card data and original list ID
              e.dataTransfer.setData('application/json', JSON.stringify({ card, fromListId: list.id }));
              onCardDragStart(card, list.id);
            },
          }}
        />
      ))}
    </div>
  );
};

export default List;
