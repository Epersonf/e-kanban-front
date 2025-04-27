// src/pages/SingleBoardPage.tsx
import React, { useEffect /* ... outros imports ... */ } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
// Remova a importação de boardsStore se todas as ações forem chamadas via props do BoardDetail
// import boardsStore from '../stores/boards.store'; // Mantenha se chamar actions diretamente aqui
import singleBoardStore from '../stores/boards/single-board.store';
import { BoardDetail } from '../components/BorderDetail/BorderDetail'
import { BoardsPageContainer, HeaderContainer, MainContent, StatusMessage } from './BoardsPage/styles';
import Header from '../components/Header';
import boardsStore from '../stores/boards/boards.store';
// ... outros imports ...

export const SingleBoardPage: React.FC = observer(() => {
    const { boardId } = useParams<{ boardId: string }>();
    const navigate = useNavigate(); // Para o delete

    // Não precisa mais de estado local para título, modal, etc. (estão em BoardDetail)

    useEffect(() => {
        if (boardId) {
            // Apenas define o ID na singleBoardStore
            singleBoardStore.setSelectedBoardId(boardId);

            // Lógica Opcional: Disparar fetch em boardsStore se o board
            // não estiver lá E boardsStore não estiver carregando.
            // Isso pode ser necessário se o usuário acessar a URL diretamente.
            // if (!singleBoardStore.selectedBoard && !boardsStore.loading && boardsStore.boards.length > 0) {
            //     console.warn(`Board ${boardId} not found in preloaded boards. Fetching needed?`);
            //     // Talvez: boardsStore.fetchBoards({ ids: [boardId], ... });
            //     // Ou apenas confiar que boardsStore.fetchBoards já rodou ou rodará.
            // }

        } else {
            // Se não houver boardId, talvez redirecionar ou mostrar mensagem
            singleBoardStore.setSelectedBoardId(null);
        }

        // Limpa o ID ao desmontar
        return () => {
            singleBoardStore.setSelectedBoardId(null);
        };
    }, [boardId]); // Depende apenas do boardId da URL

    // Obter o board selecionado (computed) e loading/error da store apropriada
    const { selectedBoard } = singleBoardStore;
    const { loading: boardsLoading, error: boardsError } = boardsStore; // Para estado inicial

    // --- Handlers que chamam as actions da store ---
    // (Mantenha os handlers que são passados como props para BoardDetail)
    // Exemplo:
    const handleSaveBoardTitle = (id: string, name: string, description?: string) => {
        boardsStore.updateBoardName(id, name, description);
    };
    const handleDeleteBoardSinglePage = (ids: string[]) => { /* ... como definido antes ... */ };
    const handleAddList = (boardId: string, name: string, order: number) => {
       return boardsStore.createSwimlane(boardId, name, order); // Retornar a Promise se necessário
    };
    const handleUpdateList = (listId: string, name: string, boardId: string, order: number) => {
        boardsStore.updateSwimlaneName(listId, name, boardId, order);
    };
    const handleDeleteList = (listId: string) => {
        boardsStore.deleteSwimlane(listId);
    };
     const handleAddCard = (listId: string, data: { title: string; description: string }) => {
         boardsStore.createTask(listId, data.title, data.description);
     };
     const handleCardUpdate = (cardId: string, listId: string, updatedData: { title?: string; description?: string }) => {
         // Chamar a action da store (que precisa ser criada)
         // boardsStore.updateTask(cardId, listId, updatedData);
         console.warn("boardsStore.updateTask não implementado", cardId, listId, updatedData);
     };
     const handleCardDelete = (cardId: string, listId: string) => {
         boardsStore.deleteTask(cardId, listId);
     };

    // --- Rendering ---
    return (
        <BoardsPageContainer>
            <MainContent>
                <HeaderContainer>
                    <Header />
                    {/* <ProfileMenu ... /> */}
                </HeaderContainer>

                {/* Decidir qual loading mostrar: o geral do boardsStore ou um específico */}
                {boardsLoading && !selectedBoard ? ( // Mostra loading geral se ainda não temos o board
                    <StatusMessage>Carregando dados...</StatusMessage>
                ) : boardsError ? (
                    <StatusMessage className="error">Erro: {boardsError}</StatusMessage>
                ) : selectedBoard ? (
                    <BoardDetail
                        board={selectedBoard}
                        onUpdateBoardTitle={handleSaveBoardTitle}
                        onDeleteBoard={handleDeleteBoardSinglePage}
                        onAddList={handleAddList}
                        onUpdateListTitle={handleUpdateList}
                        onDeleteList={handleDeleteList}
                        onAddCard={handleAddCard}
                        onUpdateCard={handleCardUpdate}
                        onDeleteCard={handleCardDelete}
                    />
                ) : !boardId ? (
                     <StatusMessage>ID do Board não fornecido.</StatusMessage>
                ) : (
                     // Se boardId existe mas selectedBoard é null após o loading inicial,
                     // significa que o board não foi encontrado no boardsStore.
                     <StatusMessage>Board com ID '{boardId}' não encontrado.</StatusMessage>
                )}
            </MainContent>
        </BoardsPageContainer>
    );
});