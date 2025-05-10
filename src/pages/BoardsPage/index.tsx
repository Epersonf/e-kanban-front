import React, { useEffect, useState } from "react";
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
} from './styles';
import { BoardDetail } from "../../components/BoardDetail/BoardDetail";
import { useBoardsStore } from "../../stores/boards/boards.store";
import { useCreateBoardsStore } from "../../stores/boards/create.boards";
import { useUpdateBoardsStore } from "../../stores/boards/update.boards";
import { useSingleBoardStore } from "../../stores/boards/single-board.store";
import { useLoginStore } from "../../stores/login.store";

export const BoardsPage: React.FC = observer(() => {
  const [selectedBoardUnique, setSelectedBoard] = useState(localStorage.getItem("selectedBoard"));
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
    const name = prompt('Nome do novo board:')?.trim();
    if (!name) return;
    const description = prompt('Descrição do novo board (opcional):')?.trim() || ' ';
    try {
      const newBoard = await createBoard.createBoard(name, description);
      if (!newBoard) return;
      boardsStore.addBoard(newBoard);
      singleBoardStore.setSelectedBoardId(newBoard.id!);
    } catch (error) {
      console.error('Erro ao criar board:', error);
    }
  };

  const handleSelectBoard = (id: string | null) => {
    singleBoardStore.setSelectedBoardId(id);
     localStorage.setItem("selectedBoard", id!);
    navigate(`/boards/${id}`);
  };

    useEffect(() => {
    if (!selectedBoard && localStorage.getItem("selectedBoard")) {
      setSelectedBoard(localStorage.getItem("selectedBoard"));
    }
  }, [selectedBoard]);

  const handleUpdateBoardTitle = (boardId: string, newTitle: string, description?: string) => {
    updateBoard.updateBoard({ updateBoard: { id: boardId, name: newTitle, description } });
  };

  const handleDeleteBoard = (ids: string[]) => {
    if (window.confirm('Tem certeza que deseja excluir este board? Isso removerá todas as listas e cartões.')) {
      if (ids.includes(selectedBoardId ?? '')) {
        singleBoardStore.setSelectedBoardId(null);
      }
      updateBoard.deleteBoard({ ids });
    }
  };

  const handleLogout = () => {
    loginStore.logout();
    navigate('/');
  };

  return (
    <BoardsPageContainer>
      <BoardMenu
        boards={boards.map(b => ({ id: b.id!, title: b.getName() }))}
        selectedBoardId={selectedBoardId}
        onSelect={handleSelectBoard}
        onCreate={handleCreateBoard}
        onUpdate={handleCreateBoard}
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
          {loading ? (
            <StatusMessage>Carregando boards...</StatusMessage>
          ) : error ? (
            <StatusMessage className="error">Erro: {error}</StatusMessage>
          ) : selectedBoard ? (
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
