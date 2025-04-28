import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../../models/general/task.model';
import { User } from '../../models/general/user.model';

// Importe os styled components
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FieldWrapper,
  FieldLabel,
  StyledInput,
  StyledTextArea,
  OwnersSection,
  SelectedOwnersContainer,
  OwnerBadge,
  OwnerAvatar,
  OwnerName,
  RemoveOwnerButton,
  OwnerSelectList,
  OwnerSelectItem,
  OwnerSelectCheckbox,
  OwnerSelectLabel,
  NoMembersText,
  ActionButtonsContainer,
  StyledButton
} from './CardDetailsModal.styles'; // Salve os estilos em CardDetailsModal.styles.ts

interface CardDetailsModalProps {
  card: Task;
  boardMembers: User[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardId: string, updates: { name?: string; description?: string; ownerIds?: string[] }) => void;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  card,
  boardMembers,
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedOwnerIds, setSelectedOwnerIds] = useState<string[]>([]);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (isOpen && card) {
      const initialName = card.getName();
      const initialDesc = card.getDescription() ?? '';
      const initialOwners = card.getOwnerIds() ?? [];
      setName(initialName);
      setDescription(initialDesc);
      setSelectedOwnerIds(initialOwners);
      setHasChanged(false);
    }
  }, [card, isOpen]);

  // --- Detectar Mudanças ---
  useEffect(() => {
    if (!isOpen || !card) return; // Só checa se aberto e com card

    const initialName = card.getName();
    const initialDesc = card.getDescription() ?? '';
    const initialOwners = card.getOwnerIds() ?? [];

    const nameChanged = name !== initialName;
    const descriptionChanged = description !== initialDesc;
    const ownersChanged =
      selectedOwnerIds.length !== initialOwners.length ||
      !selectedOwnerIds.every(id => initialOwners.includes(id)) ||
      !initialOwners.every(id => selectedOwnerIds.includes(id));

    setHasChanged(nameChanged || descriptionChanged || ownersChanged);

  }, [name, description, selectedOwnerIds, card, isOpen]);


  // --- Handlers ---
  const handleOwnerToggle = useCallback((ownerId: string) => {
    setSelectedOwnerIds(prevIds =>
      prevIds.includes(ownerId)
        ? prevIds.filter(id => id !== ownerId)
        : [...prevIds, ownerId]
    );
  }, []);

  const handleSaveClick = useCallback(() => {
    // Prepara o objeto de updates APENAS com o que mudou
    const updates: { name?: string; description?: string; ownerIds?: string[] } = {};
    if (name !== card.getName()) updates.name = name;
    if (description !== (card.getDescription() ?? '')) updates.description = description;

    const initialOwners = card.getOwnerIds() ?? [];
    const ownersChanged =
        selectedOwnerIds.length !== initialOwners.length ||
        !selectedOwnerIds.every(id => initialOwners.includes(id)) ||
        !initialOwners.every(id => selectedOwnerIds.includes(id));
    if (ownersChanged) updates.ownerIds = selectedOwnerIds;


    if (Object.keys(updates).length > 0) {
      onSave(card.id!, updates);
    }
      onClose(); // Fecha o modal após salvar ou se não houver mudanças e clicou salvar
  }, [card, name, description, selectedOwnerIds, onSave, onClose]);


  // --- Rendering ---
  if (!isOpen || !card) return null;

  const selectedOwners = boardMembers.filter(member => selectedOwnerIds.includes(member.id!));

  return (
    <ModalOverlay>
      <ModalContent>
        {/* Cabeçalho */}
        <ModalHeader>
          <ModalTitle>{card.getName()}</ModalTitle>
          <CloseButton onClick={onClose} title="Fechar">×</CloseButton>
        </ModalHeader>

        {/* Campo Título */}
        <FieldWrapper>
          <FieldLabel htmlFor="card-title">Título</FieldLabel>
          <StyledInput
            id="card-title"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="Adicione um título..."
          />
        </FieldWrapper>

        {/* Campo Descrição */}
        <FieldWrapper>
          <FieldLabel htmlFor="card-description">Descrição</FieldLabel>
          <StyledTextArea
            id="card-description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            rows={4}
            placeholder="Adicione uma descrição mais detalhada..."
          />
        </FieldWrapper>

        {/* Seção Proprietários */}
        <OwnersSection>
          <FieldLabel>Proprietários</FieldLabel>

          {/* Proprietários Selecionados */}
          {selectedOwners.length > 0 && (
            <SelectedOwnersContainer>
              {selectedOwners.map(owner => (
                <OwnerBadge key={owner.id}>
                  <OwnerAvatar
                    // src={owner.avatarUrl || `...`}
                    alt={owner.getName()}
                    title={owner.getName()}
                    size={20} // Tamanho específico aqui
                  />
                  <OwnerName>{owner.getName()}</OwnerName>
                  <RemoveOwnerButton
                    onClick={() => handleOwnerToggle(owner.id!)}
                    title="Remover"
                  >×</RemoveOwnerButton>
                </OwnerBadge>
              ))}
            </SelectedOwnersContainer>
          )}

          {/* Lista de Seleção */}
          <OwnerSelectList>
            {boardMembers.length > 0 ? boardMembers.map(member => (
              <OwnerSelectItem key={member.id} onClick={() => handleOwnerToggle(member.id!)}>
                <OwnerSelectCheckbox
                  checked={selectedOwnerIds.includes(member.id!)}
                  onChange={() => handleOwnerToggle(member.id!)}
                  id={`member-${member.id}`}
                />
                <OwnerAvatar
                  // src={member.avatarUrl || `...`}
                  alt={member.getName()}
                  size={24} // Tamanho um pouco maior na lista
                />
                <OwnerSelectLabel htmlFor={`member-${member.id}`}>
                   {member.getName()} {member.surname ? ` ${member.surname}` : ''}
                </OwnerSelectLabel>
              </OwnerSelectItem>
            )) : (
              <NoMembersText>Nenhum membro neste quadro.</NoMembersText>
            )}
          </OwnerSelectList>
        </OwnersSection>

        {/* Botões de Ação */}
        <ActionButtonsContainer>
          <StyledButton onClick={onClose}>
            Cancelar
          </StyledButton>
          <StyledButton
            $variant="primary"
            onClick={handleSaveClick}
            disabled={!hasChanged} // Desabilita se não houver mudanças
          >
            Salvar
          </StyledButton>
        </ActionButtonsContainer>

      </ModalContent>
    </ModalOverlay>
  );
};

export default CardDetailsModal;