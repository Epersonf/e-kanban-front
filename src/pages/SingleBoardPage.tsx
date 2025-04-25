import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import boardsStore from '../stores/boards.store';
import singleBoardStore from '../stores/single-board.store';
import Header from '../components/Header';
import ProfileMenu from '../components/common/ProfileMenu';
import List from '../components/List'; // Assuming List component is reusable
import AddListButton from '../components/AddListButton'; // Assuming AddListButton is reusable
import AddCardModal from '../components/AddCardModal'; // Assuming AddCardModal is reusable
import { FiEdit } from 'react-icons/fi'; // Assuming edit icon is needed
import { Swimlane } from '../models/general/swimlane.model'; // Import Swimlane model
import { Task } from '../models/general/task.model'; // Import Task model
import styles from './BoardsPage.module.css'; // Reuse the same CSS module for now

export const SingleBoardPage: React.FC = observer(() => {
  const { boardId } = useParams<{ boardId: string }>();

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [targetListId, setTargetListId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');


  // Find and set the selected board when the component mounts or boardId changes
  useEffect(() => {
    const fetchBoard = async () => {
      if (boardId) {
        await singleBoardStore.fetchBoard([boardId]);
      }
    };
    fetchBoard();
    return () => {
      singleBoardStore.setBoard(null);
    }
  }, [boardId]);

  const { selectedBoard, loading, error } = singleBoardStore;

  useEffect(() => {
    if (selectedBoard) {
      setEditingTitle(selectedBoard.getName());
    }
    setIsEditingTitle(false);
  }, [selectedBoard]);

  const handleSaveBoardTitle = () => {
    if (!selectedBoard?.id || !editingTitle.trim() || !selectedBoard) {
      setIsEditingTitle(false);
      setEditingTitle(selectedBoard?.getName() || ''); // Revert to original name
      return;
    }
    if (editingTitle.trim() !== selectedBoard.getName()) {
      boardsStore.updateBoardName(selectedBoard.id, editingTitle.trim(), selectedBoard.getDescription());
    }
    setIsEditingTitle(false);
  };

  const handleDeleteBoard = (ids: string[]) => { // ID is string
    if (!window.confirm('Tem certeza que deseja excluir este board?')) return;
    boardsStore.deleteBoard(ids);
    // After deleting, navigate back to the boards list
    // navigate('/boards'); // Assuming '/boards' is the route for the boards list
  };

  const handleAddList = async () => {
    if (!selectedBoard?.id) return;
    const name = prompt('Nome da nova lista:') || '';
    if (!name.trim()) return;
    await boardsStore.createSwimlane(selectedBoard.id, name.trim(), selectedBoard.getSwimlanes().length);
  };

  // --- Event Handlers (adapted from BoardsPage) ---
  // These handlers will need to be adapted to work within the context of a single board
  // For now, they are placeholders or simplified

  const handleUpdateList = (listId: string, name: string, order: number) => {
    if (!name.trim() || !selectedBoard?.id) return;
    boardsStore.updateSwimlaneName(listId, name.trim(), selectedBoard.id, order);
  };

  const handleDeleteList = (listId: string) => {
    if (!window.confirm('Excluir esta lista e todos os seus cartões?')) return;
    boardsStore.deleteSwimlane(listId);
  };

  const handleOpenAddCard = (listId: string) => {
    // This will likely involve a modal, similar to BoardsPage
    console.warn("Add card modal not implemented in SingleBoardPage yet");
  };

  const handleCardDelete = (cardId: string, listId: string) => {
    boardsStore.deleteTask(cardId, listId);
  };

  // --- Helper Functions for Prop Adaptation (adapted from BoardsPage) ---
  const adaptListForListComponent = (list: Swimlane): any => { // Explicitly type list and return type
    return {
      id: parseInt(list.id ?? '0', 10), // Convert string ID to number
      title: list.name!,
      cards: list.tasks!.map((task: Task) => ({ // Add explicit Task type
        id: parseInt(task.id ?? '0', 10), // Convert string ID to number
        title: task.name!,
        description: task.description! ?? ''
        // Adapt other Task properties if CardType expects them
      }))
    };
  };

  const handleCardDeleteFromList = (cardId: number, listId: number) => { // List returns numbers
    handleCardDelete(cardId.toString(), listId.toString()); // Convert back to strings for store
  };


  // --- Rendering ---
  return (
    <div className={styles["boards-page"]}> {/* Reuse boards-page styling for layout */}
      {/* BoardMenu is not needed on the single board page */}
      <div className={styles["main-content"]}> {/* Reuse main-content styling */}
        <div className={styles["header-container"]}>
          <Header />
          {/* ProfileMenu might be needed */}
          {/* <ProfileMenu userName={userName} onLogout={handleLogout} /> */}
        </div>
        {loading ? (
          <div className={styles["status-message"]}>Carregando board...</div>
        ) : error ? (
          <div className={`${styles["status-message"]} ${styles.error}`}>Erro: {error}</div>
        ) : selectedBoard ? (
          <div className={styles["board-content"]}> {/* Allow vertical scroll for content */}
            <div className={styles["board-title-area"]}>
              {/* Title editing logic will be moved here */}
              <h2 className={styles["board-title"]}>{selectedBoard.getName()}</h2>
              {/* Edit and Delete buttons will be moved here */}
            </div>
            {/* Horizontal scroll for lists */}
            <div className={styles["lists-container"]}>
              {selectedBoard.getSwimlanes() && selectedBoard.getSwimlanes().map((list: Swimlane) => ( // Explicitly type list
                <div
                  key={list.id} // Use list.id
                  className={styles["list-wrapper"]} // Prevent lists shrinking
                >
                  {/* Pass adapted list data */}
                  <List
                    list={adaptListForListComponent(list)}
                    onCardDelete={(cardId) => handleCardDeleteFromList(cardId, parseInt(list.id!, 10))}
                    onListDelete={() => handleDeleteList(list.id!)}
                    onCardDragStart={() => { console.warn("onCardDragStart not implemented"); }}
                    isDragOver={false}
                    onCardUpdate={(cardId, updatedData,) => {
                      handleUpdateList(list.id!, updatedData.title || '', parseInt(list.id!, 10));
                      console.warn("Card update not implemented in store yet", cardId.toString(), updatedData);
                    }}
                  />
                  <button
                    className={styles["add-card-button"]}
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
          <div className={styles["status-message"]}>Board não encontrado.</div>
        )}
        {/* AddCardModal will be moved here */}
        {/* <AddCardModal
          isOpen={showAddCardModal}
          onClose={() => { setShowAddCardModal(false); setTargetListId(null); }}
          onAdd={handleAddCard}
        /> */}
      </div>
    </div>
  );
});
