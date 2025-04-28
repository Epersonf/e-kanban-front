import React, { memo } from 'react';
import { Task } from '../../models/general/task.model';
import { User } from '../../models/general/user.model';
import {
  CardWrapper,
  CardContent,
  CardTitle,
  CardDescription,
  OwnersContainer,
  OwnerAvatar,
  DeleteButton
} from './Card.styles'; // Supondo que você salvou os estilos em Card.styles.ts

interface CardProps {
  card: Task;
  owners: User[];
  onDelete: () => void;
  onClick?: () => void;
  draggableProps?: any;
  dragHandleProps?: any;
  // Adicione 'innerRef' se estiver usando react-beautiful-dnd (veja nota abaixo)
  innerRef?: (element: HTMLElement | null) => void;
}

const Card: React.FC<CardProps> = memo(({
  card,
  owners,
  onDelete,
  onClick,
  draggableProps,
  dragHandleProps,
  innerRef // Para react-beautiful-dnd
}) => (
  // Use CardWrapper e passe props relevantes
  <CardWrapper
    ref={innerRef} // Para react-beautiful-dnd
    {...draggableProps}
    onClick={onClick}
  // O atributo 'draggable' é inerente ao draggableProps se vier de react-dnd ou similar
  >
    <CardContent {...dragHandleProps}>
      <CardTitle>{card.name}</CardTitle>
      {card.description && <CardDescription>{card.description}</CardDescription>}

      {owners && owners.length > 0 && (
        <OwnersContainer>
          {owners.map(member => (
            <OwnerAvatar
              key={member.id}
              // src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
              alt={member.name}
              title={member.name}
            />
          ))}
        </OwnersContainer>
      )}
    </CardContent>

    <DeleteButton
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
      }}
      title="Excluir cartão"
    >
      🗑
    </DeleteButton>
  </CardWrapper>
));

export default Card;