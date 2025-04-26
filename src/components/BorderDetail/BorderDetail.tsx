// src/components/BoardDetail/BoardDetail.tsx

import React, { useState, useCallback, useEffect, useMemo } from 'react'; // Adicionado useMemo
import { observer } from 'mobx-react-lite';
import { Board } from '../../models/general/board.model';
import { Swimlane } from '../../models/general/swimlane.model';
import { Task } from '../../models/general/task.model';
import { User } from '../../models/general/user.model'; // Importar User
import AddListButton from '../AddListButton';
import AddCardModal from '../AddCardModal';
import Card from '../Card'; // Importar Card
import CardDetailsModal from '../CardDetailsModal'; // Importar o Modal de Detalhes
import { FiEdit } from 'react-icons/fi';
import {
  BoardContent,
  BoardTitleArea,
  BoardTitle,
  TitleInput,
  EditButton,
  DeleteButton,
  ListsContainer,
  ListWrapper,
  AddCardButton,
  // Adicione um CardWrapper se precisar para D&D ou estilo
  // CardWrapper,
} from './styles';
import { List } from '../List';

interface BoardDetailProps {
  board: Board;
  onUpdateBoardTitle: (boardId: string, newTitle: string, description?: string) => void;
  onDeleteBoard: (boardIds: string[]) => void;
  onAddList: (boardId: string, name: string, order: number) => Promise<void>;
  onUpdateListTitle: (listId: string, newTitle: string, boardId: string, order: number) => void;
  onDeleteList: (listId: string) => void;
  onAddCard: (listId: string, data: { title: string; description: string }) => void;
  onUpdateCard: (cardId: string, listId: string, data: { name?: string; description?: string; ownerIds?: string[] }) => void; // Ajustado para aceitar updates
  onDeleteCard: (cardId: string, listId: string) => void;
}

export const BoardDetail: React.FC<BoardDetailProps> = observer(({
  board,
  onUpdateBoardTitle,
  onDeleteBoard,
  onAddList,
  onUpdateListTitle,
  onDeleteList,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
}) => {
  // --- State ---
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [targetListId, setTargetListId] = useState<string | null>(null);
  // State para o modal de detalhes do cartão
  const [editingCard, setEditingCard] = useState<Task | null>(null);
  const [isCardDetailsModalOpen, setIsCardDetailsModalOpen] = useState(false);

  // --- Memoização ---
  // Otimização: Obter membros e criar mapa uma vez por renderização do board
  const boardMembers = board.getMembers();
  const membersMap = useMemo(() => {
    const map = new Map<string, User>();
    boardMembers.forEach(member => map.set(member.id!, member));
    return map;
  }, [boardMembers]); // Recalcula apenas se a lista de membros do board mudar

  // --- Effects ---
  useEffect(() => {
    setEditingTitle(board.getName());
    setIsEditingTitle(false);
  }, [board]);

  // --- Handlers ---
  const handleSaveBoardTitle = useCallback(() => {
    if (!editingTitle.trim() || editingTitle.trim() === board.getName()) {
      setIsEditingTitle(false);
      setEditingTitle(board.getName());
      return;
    }
    onUpdateBoardTitle(board.id!, editingTitle.trim(), board.getDescription());
    setIsEditingTitle(false);
  }, [board, editingTitle, onUpdateBoardTitle]);

  const handleDeleteBoardClick = useCallback(() => {
    if (window.confirm(`Tem certeza que deseja excluir o board "${board.getName()}"?`)) {
      onDeleteBoard([board.id!]);
    }
  }, [board, onDeleteBoard]);

  const handleAddListClick = useCallback(async () => {
    const name = prompt('Nome da nova lista:') || '';
    if (!name.trim()) return;
    const nextOrder = board.getSwimlanes().length > 0
      ? Math.max(...board.getSwimlanes().map(l => l.order)) + 1
      : 0;
    await onAddList(board.id!, name.trim(), nextOrder);
  }, [board, onAddList]);

  // Abre o modal para adicionar um NOVO cartão
  const handleOpenAddCardModal = useCallback((listId: string) => {
    setTargetListId(listId);
    setShowAddCardModal(true);
  }, []);

  // Salva um NOVO cartão
  const handleAddCardSubmit = useCallback((data: { title: string; description: string }) => {
    if (!targetListId) return;
    onAddCard(targetListId, data);
    setShowAddCardModal(false);
    setTargetListId(null);
  }, [targetListId, onAddCard]);

  // Abre o modal para EDITAR um cartão existente
  const handleOpenCardDetailsModal = useCallback((task: Task) => {
    setEditingCard(task);
    setIsCardDetailsModalOpen(true);
  }, []);

  // Fecha o modal de detalhes
  const handleCloseCardDetailsModal = useCallback(() => {
    setIsCardDetailsModalOpen(false);
    setEditingCard(null); // Limpa o cartão em edição
  }, []);

  // Salva as alterações de um cartão existente (chamado pelo CardDetailsModal)
  const handleSaveCardDetails = useCallback((cardId: string, updates: { name?: string; description?: string; ownerIds?: string[] }) => {
    const originalCard = board.getSwimlanes()
                            .flatMap(l => l.getTasks())
                            .find(t => t.id === cardId);

    if (!originalCard) return; // Não deveria acontecer

    // Chama o callback da store para atualizar o cartão
    onUpdateCard(cardId, originalCard.getSwimlaneId(), updates);
    handleCloseCardDetailsModal(); // Fecha o modal
  }, [board, onUpdateCard, handleCloseCardDetailsModal]); // Incluir dependências


  // --- Render Function for Cards ---
  const renderCardCallback = useCallback((task: Task, listId: string /* draggableProps?: any */) => {
    // Resolve owners
    const ownerIds = task.getOwnerIds() || [];
    const taskOwners = ownerIds
      .map(id => membersMap.get(id))
      .filter((user): user is User => !!user); // Usa o mapa e filtra undefined

    return (
      // <CardWrapper key={task.id} {...draggableProps}> {/* Wrapper para D&D */}
      <div key={task.id}> {/* Wrapper simples por enquanto */}
        <Card
          card={task}
          owners={taskOwners}
          onDelete={() => {
              if (window.confirm(`Excluir o cartão "${task.getName()}"?`)) {
                  onDeleteCard(task.id!, listId);
              }
          }}
          onClick={() => handleOpenCardDetailsModal(task)} // Abre o modal de detalhes ao clicar
          // draggableProps={...} // Para D&D
        />
      </div>
      // </CardWrapper>
    );
  }, [membersMap, onDeleteCard, handleOpenCardDetailsModal]); // Incluir dependências

  // --- JSX ---
  return (
    <BoardContent>
      {/* ... (BoardTitleArea) ... */}

      <ListsContainer>
        {board.getSwimlanes()
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
                onListTitleChange={(newTitle) => onUpdateListTitle(list.id!, newTitle, board.id!, list.order)}
                // Passa a função de renderização e o ID da lista atual
                renderCard={(task, draggableProps) => renderCardCallback(task, list.id!)}
                // Outras props necessárias para List (como as de D&D se implementadas)
                onCardUpdate={onUpdateCard} // List pode precisar disso se tiver edição inline
              />
              <AddCardButton onClick={() => handleOpenAddCardModal(list.id!)}>
                + Adicionar cartão
              </AddCardButton>
            </ListWrapper>
          ))}
        <AddListButton onClick={handleAddListClick} />
      </ListsContainer>

      {/* Modal para Adicionar Novo Cartão */}
      <AddCardModal
        isOpen={showAddCardModal}
        onClose={() => { setShowAddCardModal(false); setTargetListId(null); }}
        onAdd={handleAddCardSubmit}
      />

      {/* Modal para Editar Cartão Existente */}
      {isCardDetailsModalOpen && editingCard && (
        <CardDetailsModal
          isOpen={isCardDetailsModalOpen}
          card={editingCard}
          boardMembers={boardMembers} // Passa todos os membros do board
          onClose={handleCloseCardDetailsModal}
          onSave={handleSaveCardDetails} // Passa o handler correto
        />
      )}
    </BoardContent>
  );
});