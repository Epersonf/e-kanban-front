import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi'; // Importar ícone
import BoardMenu from '../../components/BoardMenu';
import Header from '../../components/Header';
import List, { ListType } from '../../components/List';
import AddListButton from '../../components/AddListButton';
import AddCardModal from '../../components/AddCardModal';
import ProfileMenu from '../../components/common/ProfileMenu';
import { CardType } from '../../components/Card';

export interface BoardType {
  id: number;
  title: string;
  lists: ListType[];
}

const initialBoards: BoardType[] = [
  {
    id: 1,
    title: 'Meu Quadro Kanban',
    lists: [
      {
        id: 1,
        title: 'A Fazer',
        cards: [
          { id: 1, title: 'Estudar React', description: 'Aprofundar em hooks e context API.' },
          { id: 2, title: 'Criar layout', description: 'Montar estrutura inicial do projeto.' }
        ]
      },
      {
        id: 2,
        title: 'Em Progresso',
        cards: [
          { id: 3, title: 'Componentizar Kanban', description: 'Separar em componentes reutilizáveis.' }
        ]
      },
      {
        id: 3,
        title: 'Concluído',
        cards: [
          { id: 4, title: 'Configurar projeto', description: 'Criar projeto React.' }
        ]
      }
    ]
  }
];

const BoardsPage: React.FC = () => {
  const [boards, setBoards] = useState<BoardType[]>(initialBoards);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(boards[0]?.id || null);
  const [showModal, setShowModal] = useState(false);
  const [targetListId, setTargetListId] = useState<number | null>(null);
  const [draggedCard, setDraggedCard] = useState<{ card: CardType; fromListId: number } | null>(null);
  const [dragOverListId, setDragOverListId] = useState<number | null>(null);
  const [userName, setUserName] = useState('Usuário');

  // Estados para edição do título do board
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');

  const selectedBoard = boards.find(b => b.id === selectedBoardId) || null;

  // Atualiza o título de edição quando o board selecionado muda
  useEffect(() => {
    if (selectedBoard) {
      setEditingTitle(selectedBoard.title);
    }
    setIsEditingTitle(false); // Sai do modo de edição ao trocar de board
  }, [selectedBoard]);

  const handleAddList = () => {
    if (!selectedBoard) return;
    const newList: ListType = {
      id: Date.now(),
      title: `Nova Lista ${selectedBoard.lists.length + 1}`,
      cards: []
    };
    setBoards(prev =>
      prev.map(b =>
        b.id === selectedBoardId ? { ...b, lists: [...b.lists, newList] } : b
      )
    );
  };

  const handleOpenAddCard = (listId: number) => {
    setTargetListId(listId);
    setShowModal(true);
  };

  const handleAddCard = ({ title, description }: { title: string; description: string }) => {
    if (!targetListId || !selectedBoardId) return;
    setBoards(prev =>
      prev.map(b =>
        b.id === selectedBoardId
          ? {
              ...b,
              lists: b.lists.map(list =>
                list.id === targetListId
                  ? { ...list, cards: [...list.cards, { id: Date.now(), title, description }] }
                  : list
              )
            }
          : b
      )
    );
  };

  const handleCardDelete = (listId: number, cardId: number) => {
    if (!selectedBoardId) return;
    setBoards(prev =>
      prev.map(b =>
        b.id === selectedBoardId
          ? {
              ...b,
              lists: b.lists.map(list =>
                list.id === listId
                  ? { ...list, cards: list.cards.filter(card => card.id !== cardId) }
                  : list
              )
            }
          : b
      )
    );
  };

  const handleCardDragStart = (card: CardType, fromListId: number) => {
    setDraggedCard({ card, fromListId });
  };

  const handleCardDrop = (toListId: number) => {
    if (!draggedCard || !selectedBoardId || draggedCard.fromListId === toListId) {
      setDraggedCard(null);
      setDragOverListId(null);
      return;
    }

    setBoards(prev => {
      let cardToMove: CardType | undefined;
      // Remove card from the source list
      const listsWithoutCard = prev.find(b => b.id === selectedBoardId)?.lists.map(list => {
        if (list.id === draggedCard.fromListId) {
          cardToMove = list.cards.find(c => c.id === draggedCard.card.id);
          return { ...list, cards: list.cards.filter(c => c.id !== draggedCard.card.id) };
        }
        return list;
      });

      if (!cardToMove || !listsWithoutCard) return prev; // Should not happen

      // Add card to the destination list
      const listsWithCard = listsWithoutCard.map(list => {
        if (list.id === toListId) {
          return { ...list, cards: [...list.cards, cardToMove!] };
        }
        return list;
      });

      return prev.map(b => (b.id === selectedBoardId ? { ...b, lists: listsWithCard } : b));
    });

    setDraggedCard(null);
    setDragOverListId(null);
  };

  const handleCreateBoard = () => {
    const newBoard: BoardType = {
      id: Date.now(),
      title: `Novo Board ${boards.length + 1}`,
      lists: []
    };
    setBoards(prev => [...prev, newBoard]);
    setSelectedBoardId(newBoard.id);
  };

  const handleLogout = () => {
    alert('Logout!');
  };

  // Função para salvar o título editado
  const handleSaveBoardTitle = () => {
    if (!selectedBoardId || !editingTitle.trim()) {
      setIsEditingTitle(false);
      setEditingTitle(selectedBoard?.title || ''); // Reverte se vazio
      return;
    }
    setBoards(prev =>
      prev.map(b =>
        b.id === selectedBoardId ? { ...b, title: editingTitle.trim() } : b
      )
    );
    setIsEditingTitle(false);
  };

  // Função para lidar com Enter no input
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveBoardTitle();
    }
    if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setEditingTitle(selectedBoard?.title || ''); // Reverte ao pressionar Esc
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a192f' }}>
      <BoardMenu
        boards={boards}
        selectedBoardId={selectedBoardId}
        onSelect={setSelectedBoardId}
        onCreate={handleCreateBoard}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a192f' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#162447', color: '#fff', padding: '16px 24px' }}>
          <Header />
          <ProfileMenu userName={userName} onLogout={handleLogout} />
        </div>
        {selectedBoard ? (
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={handleSaveBoardTitle} // Salva ao perder foco
                  onKeyDown={handleTitleKeyDown} // Salva com Enter, cancela com Esc
                  autoFocus
                  style={{
                    fontSize: '1.5em', // Tamanho similar ao h2
                    fontWeight: 'bold',
                    color: '#fff',
                    background: '#1f4068', // Fundo para destacar
                    border: '1px solid #5dade2',
                    borderRadius: 4,
                    padding: '4px 8px',
                    outline: 'none'
                  }}
                />
              ) : (
                <h2 style={{ color: '#fff', margin: 0 }}>
                  {selectedBoard.title}
                </h2>
              )}
              {!isEditingTitle && (
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#a7c0cd', // Cor suave para o ícone
                      cursor: 'pointer',
                      padding: 4
                    }}
                    title="Editar título do board"
                  >
                    <FiEdit size={18} />
                  </button>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, overflowX: 'auto' }}>
              {selectedBoard.lists.map(list => (
                <div
                  key={list.id}
                  onDragOver={(e) => {
                      e.preventDefault(); // Necessário para permitir o drop
                      setDragOverListId(list.id);
                  }}
                  onDragLeave={() => setDragOverListId(null)}
                  onDrop={() => handleCardDrop(list.id)}
                  style={{ minWidth: 280, background: '#162447', padding: 16, borderRadius: 8 }}
                >
                  <List
                    list={list}
                    onCardDelete={cardId => handleCardDelete(list.id, cardId)}
                    onCardDragStart={handleCardDragStart}
                    isDragOver={dragOverListId === list.id}
                    onCardUpdate={(cardId, updated) => {
                      setBoards(prevBoards => prevBoards.map(board =>
                        board.id !== selectedBoardId ? board : {
                          ...board,
                          lists: board.lists.map(l =>
                            l.id !== list.id ? l : {
                              ...l,
                              cards: l.cards.map(card => card.id === cardId ? updated : card)
                            }
                          )
                        }
                      ));
                    }}
                  />
                  <button
                    style={{ marginTop: 8, background: '#1f4068', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                    onClick={() => handleOpenAddCard(list.id)}
                  >
                    + Adicionar cartão
                  </button>
                </div>
              ))}
              <AddListButton onClick={handleAddList} />
            </div>
          </div>
        ) : (
          <div style={{ color: '#fff', padding: 48, fontSize: 22, textAlign: 'center' }}>Selecione ou crie um board ao lado.</div>
        )}
        <AddCardModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAdd={handleAddCard}
        />
      </div>
    </div>
  );
};

export default BoardsPage;
