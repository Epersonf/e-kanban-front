import React from 'react';
import DeleteCardButton from './common/DeleteCardButton';

export interface CardType {
  id: number;
  title: string;
  description: string;
}

interface CardProps {
  card: CardType;
  onDelete: () => void;
  draggableProps?: React.HTMLAttributes<HTMLDivElement>;
}

const Card: React.FC<CardProps> = ({ card, onDelete, draggableProps }) => (
  <div
    {...draggableProps}
    style={{
      background: '#fff',
      borderRadius: 4,
      boxShadow: '0 1px 2px #0001',
      padding: 12,
      marginBottom: 8,
      cursor: 'grab',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      fontSize: 15,
      fontWeight: 500,
      letterSpacing: 0.1,
      lineHeight: 1.5,
    }}
    draggable
  >
    <div>
      <div style={{ fontWeight: 600, fontSize: 16 }}>{card.title}</div>
      <div style={{ fontSize: 13, color: '#555', fontWeight: 400 }}>{card.description}</div>
    </div>
    <DeleteCardButton onClick={onDelete} />
  </div>
);

export default Card;
