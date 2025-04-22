import React, { useState } from 'react';
import Header from './components/Header';
import List, { ListType } from './components/List';
import AddListButton from './components/AddListButton';
import AddCardModal from './components/AddCardModal';
import ProfileMenu from './components/common/ProfileMenu'; // Corrigido
import { CardType } from './components/Card';

// ... (código inicial mockBoard)

const mockBoard = {
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
};

export interface BoardType {
  id: number;
  title: string;
  lists: ListType[];
}

function App() {
  const [board, setBoard] = useState<BoardType>(mockBoard);
  const [showModal, setShowModal] = useState(false);
  const [targetListId, setTargetListId] = useState<number | null>(null);
  const [draggedCard, setDraggedCard] = useState<{ card: CardType; fromListId: number } | null>(null);
  const [dragOverListId, setDragOverListId] = useState<number | null>(null);
  const [userName, setUserName] = useState('Usuário');

  const handleAddList = () => {
    const newList: ListType = {
      id: Date.now(),
      title: `Nova Lista ${board.lists.length + 1}`,
      cards: []
    };
    setBoard({ ...board, lists: [...board.lists, newList] });
  };

  const handleOpenAddCard = (listId: number) => {
    setTargetListId(listId);
    setShowModal(true);
  };

  const handleAddCard = ({ title, description }: { title: string; description: string }) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === targetListId
          ? { ...list, cards: [...list.cards, { id: Date.now(), title, description }] }
          : list
      )
    }));
  };

  const handleCardDelete = (listId: number, cardId: number) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list =>
        list.id === listId
          ? { ...list, cards: list.cards.filter(card => card.id !== cardId) }
          : list
      )
    }));
  };

  const handleCardDragStart = (card: CardType, fromListId: number) => {
    setDraggedCard({ card, fromListId });
  };

  // NOTE: The drop logic here in App.tsx might be outdated
  // compared to BoardsPage.tsx, which handles drops between lists.
  // This function might need removal or adjustment if App.tsx is still used.
  const handleCardDrop = (toListId: number) => {
    if (!draggedCard || draggedCard.fromListId === toListId) {
        setDraggedCard(null);
        setDragOverListId(null);
        return;
    }

    setBoard(prev => {
        let cardToMove: CardType | undefined;
        // Remove card from old list
        const listsWithoutCard = prev.lists.map(list => {
            if (list.id === draggedCard.fromListId) {
                cardToMove = list.cards.find(c => c.id === draggedCard.card.id);
                return { ...list, cards: list.cards.filter(c => c.id !== draggedCard.card.id) };
            }
            return list;
        });

        if (!cardToMove) return prev; // Should not happen

        // Add card to new list
        const listsWithCard = listsWithoutCard.map(list => {
            if (list.id === toListId) {
                return { ...list, cards: [...list.cards, cardToMove!] };
            }
            return list;
        });
        return { ...prev, lists: listsWithCard };
    });
    setDraggedCard(null);
    setDragOverListId(null);
  };

  const handleLogout = () => {
    // Simulação de logout
    alert('Logout!');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0079bf' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#026aa7', color: '#fff', padding: '16px 24px' }}>
        <Header />
        <ProfileMenu userName={userName} onLogout={handleLogout} />
      </div>
      <div style={{ padding: 24 }}>
        <h2 style={{ color: '#fff', marginBottom: 24 }}>{board.title}</h2>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, overflowX: 'auto' }}>
          {board.lists.map(list => (
            // O div wrapper para drop foi adicionado em BoardsPage, pode ser necessário aqui também
            <div key={list.id}>
              <List
                list={list}
                onCardDelete={cardId => handleCardDelete(list.id, cardId)}
                // onCardDrop={handleCardDrop} // REMOVIDO - Prop não existe mais em ListProps
                onCardDragStart={handleCardDragStart}
                isDragOver={dragOverListId === list.id}
              />
              <button
                style={{ marginTop: 8, background: '#fff', color: '#026aa7', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => handleOpenAddCard(list.id)}
              >
                + Adicionar cartão
              </button>
            </div>
          ))}
          <AddListButton onClick={handleAddList} />
        </div>
      </div>
      <AddCardModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddCard}
      />
    </div>
  );
}

export default App;
