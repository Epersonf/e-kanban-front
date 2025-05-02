import React, { useEffect, useState } from "react"; // Apenas useState para estado local da página (ex: userName)
import { observer } from "mobx-react-lite";
import { useNavigate } from 'react-router-dom';

// Componentes
import BoardMenu from "../../components/BoardMenu/BoardMenu";
import Header from "../../components/Header/Header";
import ProfileMenu from "../../components/ProfileMenu/ProfileMenu";

// Stores


// Estilos
import {
  BoardsPageContainer,
  MainContent,
  HeaderContainer,
  StatusMessage,
  ScrollableBoardArea,
} from './styles'; // Apenas estilos do layout da página
import { BoardDetail } from "../../components/BoardDetail/BoardDetail";
import { useBoardsStore } from "../../stores/boards/boards.store";
import { useCreateBoardsStore } from "../../stores/boards/create.boards";
import { useUpdateBoardsStore } from "../../stores/boards/update.boards";
import { useSingleBoardStore } from "../../stores/boards/single-board.store";
import { useCreateSwimlaneStore } from "../../stores/swinlane/create.swimlanes";
import { useUpdateSwimlanesStore } from "../../stores/swinlane/update.swimlanes";

export const BoardsPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const boardsStore = useBoardsStore();
  const createBoard = useCreateBoardsStore();
  const updateBoard = useUpdateBoardsStore();
  const singleBoardStore = useSingleBoardStore();
  const createSwimlane = useCreateSwimlaneStore();
  const updateSwimlane = useUpdateSwimlanesStore();

  // Estado Local da Página (Exemplo: info do usuário, se não vier de store de auth)
  const [userName, setUserName] = useState('Usuário');

  // --- Obter Dados das Stores ---
  const { boards, loading, error } = boardsStore;
  const { selectedBoard, selectedBoardId } = singleBoardStore; // Pega o ID também para o BoardMenu

  useEffect(() => {
    boardsStore.fetchBoards(); // Substitua por sua ação real da store
  }, []); 

  // --- Handlers que Chamam Actions da Store ---
  // Estes permanecem na página pois interagem com as stores e navegação

  const handleCreateBoard = async () => {
    const name = prompt('Nome do novo board:') || '';
    if (!name.trim()) return;
    const description = prompt('Descrição do novo board (opcional):') || '';
    try {
      const newBoard = await createBoard.createBoard(name.trim(), description.trim());
      if (!newBoard) return;
      boardsStore.addBoard(newBoard);
      
    } catch (error) {
      
    }
    // Opcional: selecionar o novo board após criação?
  };

  const handleSelectBoard = (id: string | null) => {
    singleBoardStore.setSelectedBoardId(id);
    // A navegação pode ou não ser necessária dependendo se BoardsPage mostra detalhes
    if (id) {
      // Se BoardsPage mostra detalhes, não precisa navegar
      // navigate(`/boards/${id}`); // Descomente se BoardsPage *não* mostra detalhes
    } else {
      // Se deselecionar, pode querer limpar a URL ou navegar para /boards
      // navigate('/boards'); // Descomente se necessário
    }
  };

  // Handlers para passar como props para BoardDetail
  const handleUpdateBoardTitle = (boardId: string, newTitle: string, description?: string) => {
    updateBoard.updateBoardName(boardId, newTitle, description);
  };

  const handleDeleteBoard = (ids: string[]) => {
    // Confirmação pode ser movida para BoardDetail se preferir
    if (window.confirm('Tem certeza que deseja excluir este board? Isso removerá todas as listas e cartões.')) {
      // Se o board deletado for o selecionado, limpa a seleção
      if (ids.includes(selectedBoardId ?? '')) {
        singleBoardStore.setSelectedBoardId(null);
        // Talvez navegar para /boards se a URL ainda for específica
        // navigate('/boards');
      }
      updateBoard.deleteBoard(ids);
    }
  };

  const handleAddList = (boardId: string, name: string, order: number) => {
    // A action da store já é async, então retornamos a Promise
    return createSwimlane.createSwimlane(boardId, name, order);
  };

  const handleUpdateListTitle = (listId: string, newTitle: string, boardId: string, order: number) => {
    updateSwimlane.updateSwimlaneName(listId, newTitle, boardId, order);
  };

  const handleDeleteList = (listId: string) => {
    // Confirmação pode ser movida para BoardDetail
    if (window.confirm('Excluir esta lista e todos os seus cartões?')) {
      updateSwimlane.deleteSwimlane(listId);
    }
  };

  // const handleAddCard = (listId: string, data: { title: string; description: string }) => {
  //   createBoard.createTask(listId, data.title, 0, data.description);
  // };

  const handleCardUpdate = (cardId: string, listId: string, updatedData: { title?: string; description?: string }) => {
    // *** Chamar a action que precisa ser criada na store ***
    // boardsStore.moveTask(cardId, listId, updatedData);
    console.warn("Ação boardsStore.updateTask não implementada", cardId, listId, updatedData);
  };

  const handleCardDelete = (cardId: string, listId: string) => {
    // Confirmação pode ser movida para dentro do componente Card/List ou BoardDetail
    if (window.confirm('Excluir este cartão?')) {
      updateBoard.deleteTask(cardId, listId);
    }
  };

  // Outros Handlers da Página
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Ou usar navigate('/login') se o roteador cobrir
  };

  // --- Funções de Adaptação Removidas ---
  // adaptBoardsForMenu, adaptSelectedBoardIdForMenu, handleSelectBoardFromMenu
  // adaptListForListComponent, handleCardDeleteFromList foram removidas

  // --- Rendering ---
  return (
    <BoardsPageContainer>
      {/* BoardMenu agora usa IDs string e recebe dados diretamente */}
      <BoardMenu
        boards={boards.map(b => ({ id: b.id!, title: b.getName() }))} // Mapeamento simples inline
        selectedBoardId={selectedBoardId} // Passa o ID string ou null
        onSelect={handleSelectBoard} // Handler já espera string
        onCreate={handleCreateBoard}
        onUpdate={handleCreateBoard}
      // onDelete={(id: string) => handleDeleteBoard([id])} // Passar array de ID
      />
      <MainContent>
        <HeaderContainer>
          <Header />
          <ProfileMenu userName={userName} onLogout={handleLogout} />
        </HeaderContainer>

        <ScrollableBoardArea>
          {/* Lógica de Renderização Principal */}
          {loading ? (
            <StatusMessage>Carregando boards...</StatusMessage>
          ) : error ? (
            <StatusMessage className="error">Erro: {error}</StatusMessage>
          ) : selectedBoard ? (
            // Renderiza BoardDetail quando um board está selecionado
            <BoardDetail
              board={selectedBoard}
              onUpdateBoardTitle={handleUpdateBoardTitle}
              onDeleteBoard={handleDeleteBoard}
              // onAddList={handleAddList}
              // onUpdateListTitle={handleUpdateListTitle}
              // onDeleteList={handleDeleteList}
              // onAddCard={handleAddCard}
              // onUpdateCard={handleCardUpdate} // Passa o handler (implementar action na store)
              // onDeleteCard={handleCardDelete}
            />
          ) : (
            // Mensagem quando nenhum board está selecionado
            <StatusMessage>
              {boards.length > 0 ? "Selecione um board ao lado para começar." : "Crie seu primeiro board!"}
            </StatusMessage>
          )}
          {/* AddCardModal foi movido para BoardDetail */}
        </ScrollableBoardArea>
      </MainContent>
    </BoardsPageContainer>
  );
});