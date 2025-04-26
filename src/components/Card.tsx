import React from 'react';
import { Task } from '../models/general/task.model';
import { User } from '../models/general/user.model';

interface CardProps {
  card: Task;
  owners: User[];
  onDelete: () => void;
  onClick?: () => void;
  draggableProps?: React.HTMLAttributes<HTMLDivElement>;
}

const Card: React.FC<CardProps> = ({ card, owners, onDelete, onClick, draggableProps }) => (
  <div
    {...draggableProps}
    style={{
      background: '#fff',
      borderRadius: 4,
      boxShadow: '0 1px 2px #0001',
      padding: 12,
      marginBottom: 8,
      cursor: 'pointer',
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
    onClick={onClick}
  >
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, fontSize: 16 }}>{card.name}</div>
      <div style={{ fontSize: 13, color: '#555', fontWeight: 400 }}>{card.description}</div>
      {owners && owners.length > 0 && (
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {owners.map(member => (
            <img
              key={member.id}
              // src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
              alt={member.name}
              title={member.name}
              style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #eee', objectFit: 'cover' }}
            />
          ))}
        </div>
      )}
    </div>
    <button
      onClick={e => {
        e.stopPropagation();
        onDelete();
      }}
      style={{ color: '#d32f2f', background: '#fff', border: '1px solid #d32f2f', marginLeft: 8, borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', fontSize: 16 }}
      title="Excluir cartão"
    >
      🗑
    </button>
  </div>
);

export default Card;
