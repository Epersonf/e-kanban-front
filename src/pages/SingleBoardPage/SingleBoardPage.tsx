import React, { useEffect /* ... outros imports ... */ } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { BoardDetail } from '../../components/BoardDetail/BoardDetail'
import { BoardsPageContainer, HeaderContainer, MainContent, StatusMessage } from '../BoardsPage/styles';
import Header from '../../components/Header/Header';
import { useSingleBoardStore } from '../../stores/boards/single-board.store';
import { useBoardsStore } from '../../stores/boards/boards.store';
import { useCreateSwimlaneStore } from '../../stores/swinlane/create.swimlanes';
import { useUpdateSwimlanesStore } from '../../stores/swinlane/update.swimlanes';
import { useCreateBoardsStore } from '../../stores/boards/create.boards';
import { useUpdateBoardsStore } from '../../stores/boards/update.boards';
// ... outros imports ...

export const SingleBoardPage: React.FC = observer(() => {
	const { boardId } = useParams<{ boardId: string }>();
	const navigate = useNavigate(); // Para o delete
	const singleBoardStore = useSingleBoardStore();
	const boardsStore = useBoardsStore();
	const createSwimlane = useCreateSwimlaneStore();
	const updateSwimlane = useUpdateSwimlanesStore();
	const createBoard = useCreateBoardsStore();
	const updateBoard = useUpdateBoardsStore();

	// Não precisa mais de estado local para título, modal, etc. (estão em BoardDetail)

	useEffect(() => {
		if (boardId) {
			// Apenas define o ID na singleBoardStore
			singleBoardStore.setSelectedBoardId(boardId);

			// Lógica Opcional: Disparar fetch em boardsStore se o board
			// não estiver lá E boardsStore não estiver carregando.
			// Isso pode ser necessário se o usuário acessar a URL diretamente.
			if (!singleBoardStore.selectedBoard && !boardsStore.loading && boardsStore.boards.length > 0) {
			    console.warn(`Board ${boardId} not found in preloaded boards. Fetching needed?`);
			    // Talvez: 
					boardsStore.fetchBoards({ ids: [boardId], ...singleBoardStore });
			    // Ou apenas confiar que boardsStore.fetchBoards já rodou ou rodará.
			}

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
		updateBoard.updateBoard(id, name, description);
	};
	const handleDeleteBoardSinglePage = (ids: string[]) => { /* ... como definido antes ... */ };
	const handleAddList = (boardId: string, name: string, order: number) => {
		return createSwimlane.createSwimlane(boardId, name, order); // Retornar a Promise se necessário
	};
	const handleUpdateList = (listId: string, name: string, boardId: string, order: number) => {
		updateSwimlane.updateSwimlaneName(listId, name, boardId, order);
	};
	const handleDeleteList = (listId: string) => {
		updateSwimlane.deleteSwimlane(listId);
	};
	// const handleAddCard = (listId: string, data: { title: string; description: string }) => {
	// 	createBoard.createTask(listId, data.title, data.description);
	// };
	const handleCardUpdate = (cardId: string, listId: string, updatedData: { title?: string; description?: string }) => {
		// Chamar a action da store (que precisa ser criada)
		// boardsStore.updateTask(cardId, listId, updatedData);
		console.warn("boardsStore.updateTask não implementado", cardId, listId, updatedData);
	};
	const handleCardDelete = (cardId: string, listId: string) => {
		updateBoard.deleteTask(cardId, listId);
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
						// onAddList={handleAddList}
						// onUpdateListTitle={handleUpdateList}
						// onDeleteList={handleDeleteList}
						// onAddCard={handleAddCard}
						// onUpdateCard={handleCardUpdate}
						// onDeleteCard={handleCardDelete}
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