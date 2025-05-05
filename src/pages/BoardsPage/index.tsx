import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from 'react-router-dom';

import BoardMenu from "../../components/BoardMenu/BoardMenu";
import Header from "../../components/Header/Header";
import ProfileMenu from "../../components/ProfileMenu/ProfileMenu";

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
import { useLoginStore } from "../../stores/login.store";

export const BoardsPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const boardsStore = useBoardsStore();
  const createBoard = useCreateBoardsStore();
  const updateBoard = useUpdateBoardsStore();
  const singleBoardStore = useSingleBoardStore();
  const loginStore = useLoginStore();

  const { boards, loading, error } = boardsStore;
  const { selectedBoard, selectedBoardId } = singleBoardStore;

  useEffect(() => {
    boardsStore.fetchBoards();
  }, []); 

  const handleCreateBoard = async () => {
    const name = prompt('Nome do novo board:') || '';
    if (!name.trim()) return;
    const description = prompt('Descrição do novo board (opcional):') || '';
    try {
      const newBoard = await createBoard.createBoard(name.trim(), description.trim() || ' ');
      if (!newBoard) return;
      boardsStore.addBoard(newBoard);
      
      singleBoardStore.setSelectedBoardId(newBoard.id!);
    } catch (error) {
      console.error('Erro ao criar board:', error);  
    }
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

  const handleUpdateBoardTitle = (boardId: string, newTitle: string, description?: string) => {
    updateBoard.updateBoard(boardId, newTitle, description);
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

  const handleLogout = () => {
    loginStore.logout();
    navigate('/');
  };

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
          <ProfileMenu
            userName={loginStore.fullName}
            onLogout={handleLogout}
          />
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
            />
          ) : (
            <StatusMessage>
              {boards.length > 0 ? "Selecione um board ao lado para começar." : "Crie seu primeiro board!"}
            </StatusMessage>
          )}
        </ScrollableBoardArea>
      </MainContent>
    </BoardsPageContainer>
  );
});