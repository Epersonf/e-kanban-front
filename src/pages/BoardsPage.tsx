import React, { useState } from "react"; // Keep useState for local UI state like modals, editing title
import { observer } from "mobx-react-lite";
import List from "../components/List"; // Assuming List component is compatible with Swimlane model
// import { CardType } from "../components/Card"; // CardType might need adjustment or use Task model directly in Card component
import BoardMenu from "../components/BoardMenu";
import Header from "../components/Header";
import ProfileMenu from "../components/common/ProfileMenu";
import AddListButton from "../components/AddListButton";
import AddCardModal from "../components/AddCardModal";
import { FiEdit } from "react-icons/fi";
import boardsStore from "../stores/boards.store"; // Import the store instance
import { Task } from "../models/general/task.model"; // Import Task model
import { Swimlane } from "../models/general/swimlane.model"; // Import Swimlane model

// Remove local BoardType interface if Board model from store is used directly

export const BoardsPage: React.FC = observer(() => { // Wrap component with observer
  // Local UI state remains
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [targetListId, setTargetListId] = useState<string | null>(null); // Use string for ID
  // const [draggedCard, setDraggedCard] = useState<{ card: Task; fromListId: string } | null>(null); // Adjust if using Task model
  // const [dragOverListId, setDragOverListId] = useState<string | null>(null); // Use string for ID
  const [userName, setUserName] = useState('Usuário'); // Keep local or move to a user store
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');

  // Get data from the store
  const { boards, selectedBoardId, loading, error, selectedBoard } = boardsStore;

  // Update local editing title when selected board changes
  React.useEffect(() => {
    if (selectedBoard) {
      setEditingTitle(selectedBoard.getName()); // Use getName()
    }
    setIsEditingTitle(false); // Reset editing state on board change
  }, [selectedBoard]);

  // --- Event Handlers ---

  // Board Handlers (call store actions)
  const handleCreateBoard = () => {
    const name = prompt('Nome do novo board:') || '';
    if (!name.trim()) return;
    const description = prompt('Descrição do novo board (opcional):') || '';
    boardsStore.createBoard(name.trim(), description.trim());
  };

  const handleSelectBoard = (id: string | null) => { // ID is string
    boardsStore.selectBoard(id);
  };

  const handleSaveBoardTitle = () => {
    if (!selectedBoardId || !editingTitle.trim() || !selectedBoard) {
      setIsEditingTitle(false);
      setEditingTitle(selectedBoard?.getName() || ''); // Revert to original name
      return;
    }
    if (editingTitle.trim() !== selectedBoard.getName()) {
        boardsStore.updateBoardName(selectedBoardId, editingTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleDeleteBoard = (id: string) => { // ID is string
    if (!window.confirm('Tem certeza que deseja excluir este board?')) return;
    boardsStore.deleteBoard(id);
  };

  // Swimlane (List) Handlers
  const handleAddList = () => {
    if (!selectedBoardId) return;
    const name = prompt('Nome da nova lista:') || '';
    if (!name.trim()) return;
    boardsStore.createSwimlane(selectedBoardId, name.trim());
  };

  // Note: UpdateList handler was missing in original, assuming it's needed for List component title editing
  const handleUpdateList = (listId: string, name: string) => { // ID is string
     if (!name.trim()) return; // Prevent empty names
     boardsStore.updateSwimlaneName(listId, name.trim());
  };


  const handleDeleteList = (listId: string) => { // ID is string
    if (!window.confirm('Excluir esta lista e todos os seus cartões?')) return;
    boardsStore.deleteSwimlane(listId);
  };

  // Task (Card) Handlers
  const handleOpenAddCard = (listId: string) => { // ID is string
    setTargetListId(listId);
    setShowAddCardModal(true);
  };

  const handleAddCard = ({ title, description }: { title: string; description: string }) => {
    if (!targetListId) return;
    boardsStore.createTask(targetListId, title, description);
    setShowAddCardModal(false); // Close modal on success
    setTargetListId(null);
  };

  const handleCardDelete = (cardId: string, listId: string) => { // IDs are string
    // Confirmation might be desired here too
    boardsStore.deleteTask(cardId, listId);
  };

  // Drag and Drop Handlers (Simplified - requires store implementation)
  // const handleCardDragStart = (card: Task, fromListId: string) => {
  //   // setDraggedCard({ card, fromListId });
  //   // Potentially call a store action to set dragging state
  // };

  // const handleCardDrop = (toListId: string) => {
  //   // if (draggedCard && toListId !== draggedCard.fromListId) {
  //   //   boardsStore.moveTask(draggedCard.card.id, draggedCard.fromListId, toListId);
  //   // }
  //   // setDraggedCard(null);
  //   // setDragOverListId(null);
  //   // Potentially call a store action to clear dragging state
  // };

  // Other Handlers
  const handleLogout = () => {
    // This could also be moved to an auth store
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
  };

  // --- Helper Functions for Prop Adaptation ---
  const adaptBoardsForMenu = () => {
    return boards.map(b => ({
      id: parseInt(b.id ?? '0', 10), // Convert string ID to number, default to 0 if undefined
      title: b.getName()
    }));
  };

  const adaptSelectedBoardIdForMenu = () => {
    return selectedBoardId ? parseInt(selectedBoardId, 10) : null;
  };

  const handleSelectBoardFromMenu = (id: number) => { // BoardMenu returns number
    handleSelectBoard(id.toString()); // Convert back to string for store
  };

  const adaptListForListComponent = (list: Swimlane) => {
    return {
      id: parseInt(list.id ?? '0', 10), // Convert string ID to number
      title: list.getName(),
      cards: list.getTasks().map((task: Task) => ({ // Add explicit Task type
        id: parseInt(task.id ?? '0', 10), // Convert string ID to number
        title: task.getName(),
        description: task.getDescription() ?? ''
        // Adapt other Task properties if CardType expects them
      }))
    };
  };

  const handleCardDeleteFromList = (cardId: number, listId: number) => { // List returns numbers
     handleCardDelete(cardId.toString(), listId.toString()); // Convert back to strings for store
  };


  // --- Rendering ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a192f' }}>
      <BoardMenu
        // Pass adapted props
        boards={adaptBoardsForMenu()}
        selectedBoardId={adaptSelectedBoardIdForMenu()}
        onSelect={handleSelectBoardFromMenu} // Use adapted handler
        onCreate={handleCreateBoard}
        // onDelete={(id: number) => handleDeleteBoard(id.toString())} // Adapt delete if needed
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a192f' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#162447', color: '#fff', padding: '16px 24px' }}>
          <Header />
          <ProfileMenu userName={userName} onLogout={handleLogout} />
        </div>
        {loading ? (
          <div style={{ color: '#fff', padding: 48, fontSize: 22, textAlign: 'center' }}>Carregando boards...</div>
        ) : error ? (
          <div style={{ color: 'red', padding: 48, fontSize: 22, textAlign: 'center' }}>Erro: {error}</div>
        ) : selectedBoard ? (
          <div style={{ padding: 24, overflowY: 'auto' }}> {/* Allow vertical scroll for content */}
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
                      setEditingTitle(selectedBoard.getName()); // Revert
                    }
                  }}
                  autoFocus
                  style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#fff', background: '#1f4068', border: '1px solid #5dade2', borderRadius: 4, padding: '4px 8px', outline: 'none' }}
                />
              ) : (
                // Use getName()
                <h2 style={{ color: '#fff', margin: 0 }}>{selectedBoard.getName()}</h2>
              )}
              {!isEditingTitle && selectedBoard.id && ( // Only show edit if not editing and board exists
                <button
                  onClick={() => setIsEditingTitle(true)}
                  style={{ background: 'transparent', border: 'none', color: '#a7c0cd', cursor: 'pointer', padding: 4 }}
                  title="Editar título do board"
                >
                  <FiEdit size={18} />
                </button>
              )}
              {selectedBoard.id && ( // Only show delete if board exists
                 <button
                    onClick={() => handleDeleteBoard(selectedBoard.id!)} // Use non-null assertion or check id
                    style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer', marginLeft: 12 }}
                    title="Excluir board"
                  >Excluir</button>
              )}
            </div>
            {/* Horizontal scroll for lists */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, overflowX: 'auto', paddingBottom: '16px' }}>
              {selectedBoard.getSwimlanes() && selectedBoard.getSwimlanes().map(list => (
                <div
                  key={list.id} // Use list.id
                  // onDragOver={(e) => {
                  //     e.preventDefault();
                  //     setDragOverListId(list.id!); // Use non-null assertion or check id
                  // }}
                  // onDragLeave={() => setDragOverListId(null)}
                  // onDrop={() => handleCardDrop(list.id!)} // Use non-null assertion or check id
                  style={{ minWidth: 280, background: '#162447', padding: 16, borderRadius: 8, flexShrink: 0 }} // Prevent lists shrinking
                >
                  {/* Pass adapted list data */}
                  <List
                    list={adaptListForListComponent(list)}
                    // Adapt handlers to convert IDs back to string for store actions
                    onCardDelete={(cardId) => handleCardDeleteFromList(cardId, parseInt(list.id!, 10))} // Use adapted handler
                    // onListDelete={() => handleDeleteList(list.id!)} // Removed prop
                    // onListTitleChange={(newTitle: string) => handleUpdateList(list.id!, newTitle)} // Removed prop
                    onCardDragStart={() => { console.warn("onCardDragStart not implemented"); }} // Placeholder
                    isDragOver={false} // Placeholder - requires state like dragOverListId
                    onCardUpdate={(cardId, updatedData) => {
                        // This needs a store action: boardsStore.updateTask(cardId, updatedData)
                        // Need to convert cardId back to string for store
                        console.warn("Card update not implemented in store yet", cardId.toString(), updatedData);
                    }}
                  />
                  <button
                    style={{ marginTop: 8, background: '#1f4068', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
                    onClick={() => handleOpenAddCard(list.id!)} // Use non-null assertion or check id
                  >
                    + Adicionar cartão
                  </button>
                </div>
              ))}
              <AddListButton onClick={handleAddList} />
            </div>
          </div>
        ) : (
          <div style={{ color: '#fff', padding: 48, fontSize: 22, textAlign: 'center' }}>
            {boards.length > 0 ? "Selecione um board ao lado." : "Crie seu primeiro board!"}
          </div>
        )}
        <AddCardModal
          isOpen={showAddCardModal}
          onClose={() => { setShowAddCardModal(false); setTargetListId(null); }}
          onAdd={handleAddCard}
        />
      </div>
    </div>
  );
});
