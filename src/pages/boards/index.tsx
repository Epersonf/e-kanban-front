import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import BoardMenu from '../../components/BoardMenu';
import Header from '../../components/Header';
import List, { ListType } from '../../components/List';
import AddListButton from '../../components/AddListButton';
import AddCardModal from '../../components/AddCardModal';
import ProfileMenu from '../../components/common/ProfileMenu';
import { CardType } from '../../components/Card';
import { getBoards, createBoard, updateBoard, deleteBoard, createSwimlane, updateSwimlane, deleteSwimlane, createTask, deleteTask } from '../../api';

export interface BoardType {
  id: number;
  title: string;
  lists: ListType[];
}

const BoardsPage: React.FC = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [targetListId, setTargetListId] = useState<number | null>(null);
  const [draggedCard, setDraggedCard] = useState<{ card: CardType; fromListId: number } | null>(null);
  const [dragOverListId, setDragOverListId] = useState<number | null>(null);
  const [userName, setUserName] = useState('Usuário');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');

  // Buscar boards ao carregar
  useEffect(() => {
    setLoading(true);
    getBoards()
      .then(res => {
        setBoards(res.data || []);
        setSelectedBoardId(res.data && res.data.length > 0 ? res.data[0].id : null);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao buscar boards');
        setLoading(false);
      });
  }, []);

  const selectedBoard = boards.find(b => b.id === selectedBoardId) || null;

  // Atualiza o título de edição quando o board selecionado muda
  useEffect(() => {
    if (selectedBoard) {
      setEditingTitle(selectedBoard.title);
    }
    setIsEditingTitle(false);
  }, [selectedBoard]);

  // Criar novo board
  const handleCreateBoard = async () => {
    const name = prompt('Nome do novo board:') || '';
    if (!name.trim()) return;
    const description = prompt('Descrição do novo board:') || '';
    try {
      const res = await createBoard({ boards: [{ name, description }] });
      // Supondo que a API retorna o(s) board(s) criado(s) em res.data.boards
      const newBoard = res.data.boards?.[0] || res.data;
      setBoards(prev => [...prev, newBoard]);
      setSelectedBoardId(newBoard.id);
    } catch {
      setError('Erro ao criar board');
    }
  };


  // Atualizar título do board
  const handleSaveBoardTitle = async () => {
    if (!selectedBoardId || !editingTitle.trim()) {
      setIsEditingTitle(false);
      setEditingTitle(selectedBoard?.title || '');
      return;
    }
    try {
      await updateBoard({ id: selectedBoardId, title: editingTitle.trim() });
      setBoards(prev => prev.map(b => b.id === selectedBoardId ? { ...b, title: editingTitle.trim() } : b));
      setIsEditingTitle(false);
    } catch {
      setError('Erro ao atualizar título do board');
    }
  };

  // Deletar board
  const handleDeleteBoard = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este board?')) return;
    try {
      await deleteBoard(id);
      setBoards(prev => prev.filter(b => b.id !== id));
      setSelectedBoardId(boards.length > 1 ? boards.filter(b => b.id !== id)[0]?.id || null : null);
    } catch {
      setError('Erro ao deletar board');
    }
  };

  // ------ INTEGRAÇÃO SWIMLANES (LISTAS) ------
  const handleAddList = async () => {
    if (!selectedBoard) return;
    const title = prompt('Nome da nova lista:') || '';
    if (!title.trim()) return;
    try {
      const res = await createSwimlane({ boardId: selectedBoard.id, title });
      setBoards(prev => prev.map(b =>
        b.id === selectedBoard.id
          ? { ...b, lists: [...(b.lists || []), res.data] }
          : b
      ));
    } catch {
      setError('Erro ao criar lista');
    }
  };

  const handleUpdateList = async (listId: number, title: string) => {
    try {
      await updateSwimlane({ id: listId, title });
      setBoards(prev => prev.map(b =>
        b.id !== selectedBoardId ? b : {
          ...b,
          lists: b.lists.map(l => l.id === listId ? { ...l, title } : l)
        }
      ));
    } catch {
      setError('Erro ao atualizar lista');
    }
  };

  const handleDeleteList = async (listId: number) => {
    if (!window.confirm('Excluir esta lista?')) return;
    try {
      await deleteSwimlane(listId);
      setBoards(prev => prev.map(b =>
        b.id !== selectedBoardId ? b : {
          ...b,
          lists: b.lists.filter(l => l.id !== listId)
        }
      ));
    } catch {
      setError('Erro ao deletar lista');
    }
  };

  // ------ INTEGRAÇÃO TASKS (CARDS) ------
  const handleOpenAddCard = (listId: number) => {
    setTargetListId(listId);
    setShowModal(true);
  };

  const handleAddCard = async ({ title, description }: { title: string; description: string }) => {
    if (!targetListId) return;
    try {
      const res = await createTask({ swimlaneId: targetListId, title, description });
      setBoards(prev => prev.map(b =>
        b.id !== selectedBoardId ? b : {
          ...b,
          lists: b.lists.map(l =>
            l.id !== targetListId ? l : { ...l, cards: [...(l.cards || []), res.data] }
          )
        }
      ));
      setShowModal(false);
    } catch {
      setError('Erro ao adicionar cartão');
    }
  };

  const handleCardDelete = async (listId: number, cardId: number) => {
    try {
      await deleteTask(cardId);
      setBoards(prev => prev.map(b =>
        b.id !== selectedBoardId ? b : {
          ...b,
          lists: b.lists.map(l =>
            l.id !== listId ? l : { ...l, cards: l.cards.filter(c => c.id !== cardId) }
          )
        }
      ));
    } catch {
      setError('Erro ao deletar cartão');
    }
  };

  const handleCardDragStart = (card: CardType, fromListId: number) => {
    setDraggedCard({ card, fromListId });
  };

  // (Drag and drop pode ser integrado depois com PATCH nos endpoints de swimlane/task)
  const handleCardDrop = (toListId: number) => {
    setDraggedCard(null);
    setDragOverListId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
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
        {loading ? (
          <div style={{ color: '#fff', padding: 48, fontSize: 22, textAlign: 'center' }}>Carregando boards...</div>
        ) : error ? (
          <div style={{ color: 'red', padding: 48, fontSize: 22, textAlign: 'center' }}>{error}</div>
        ) : selectedBoard ? (
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={handleSaveBoardTitle}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveBoardTitle();
                    if (e.key === 'Escape') {
                      setIsEditingTitle(false);
                      setEditingTitle(selectedBoard.title);
                    }
                  }}
                  autoFocus
                  style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#fff', background: '#1f4068', border: '1px solid #5dade2', borderRadius: 4, padding: '4px 8px', outline: 'none' }}
                />
              ) : (
                <h2 style={{ color: '#fff', margin: 0 }}>{selectedBoard.title}</h2>
              )}
              {!isEditingTitle && (
                <button
                  onClick={() => setIsEditingTitle(true)}
                  style={{ background: 'transparent', border: 'none', color: '#a7c0cd', cursor: 'pointer', padding: 4 }}
                  title="Editar título do board"
                >
                  <FiEdit size={18} />
                </button>
              )}
              <button
                onClick={() => handleDeleteBoard(selectedBoard.id)}
                style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer', marginLeft: 12 }}
                title="Excluir board"
              >Excluir</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, overflowX: 'auto' }}>
              {selectedBoard.lists && selectedBoard.lists.map(list => (
                <div
                  key={list.id}
                  onDragOver={(e) => {
                      e.preventDefault();
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
