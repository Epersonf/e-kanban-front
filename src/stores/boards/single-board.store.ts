// src/stores/single-board.store.ts
// src/stores/single-board.store.ts
import { makeAutoObservable, computed, runInAction } from 'mobx';
import { Board } from '../../models/general/board.model';
import { Task } from '../../models/general/task.model';
import { useBoardsStore } from './boards.store';
import { TasksApi, UpdateTaskPayload } from '../../infra/api/tasks.api';

export class SingleBoardStore {
	selectedBoardId: string | null = null;
	isEditingTitle: boolean = false;
	editingTitle: string = '';
	showTaskModal: boolean = false;
	targetSwimlaneId: string | null = null;
	taskToEdit: Task | null = null;

	boardStore = useBoardsStore();

	constructor() {
		makeAutoObservable(this, {
			selectedBoard: computed
		});
	}

	setSelectedBoardId(id: string | null): void {
		runInAction(() => {
			this.selectedBoardId = id;
			// Reset state when board changes
			this.isEditingTitle = false;
			this.editingTitle = '';
			this.showTaskModal = false;
			this.targetSwimlaneId = null;
			this.taskToEdit = null;
		});
	}

	setEditingTitle(value: string): void {
		runInAction(() => {
			this.editingTitle = value;
		});
	}

	setIsEditingTitle(value: boolean): void {
		runInAction(() => {
			this.isEditingTitle = value;
			if (!value && this.selectedBoard) {
				this.editingTitle = this.selectedBoard.getName();
			}
		});
	}

	setShowTaskModal(value: boolean): void {
		runInAction(() => {
			this.showTaskModal = value;
		});
	}

	setTargetSwimlaneId(value: string | null): void {
		runInAction(() => {
			this.targetSwimlaneId = value;
		});
	}

	setTaskToEdit(task: Task | null): void {
		runInAction(() => {
			this.taskToEdit = task;
		});
	}

	get selectedBoard(): Board | null {
		if (!this.selectedBoardId) {
			return null;
		}
		const board = this.boardStore.boards.find(b => b.id === this.selectedBoardId);
		return board || null;
	}

	setBoard(board: Board | null): void {
		runInAction(() => {
			this.selectedBoardId = board?.id ?? null;
			if (board) {
				this.editingTitle = board.getName();
			} else {
				this.editingTitle = '';
			}
		});
	}

	handleOpenTaskModal(swimlaneId: string, task?: Task): void {
		runInAction(() => {
			this.setTargetSwimlaneId(swimlaneId);
			if (task) {
				this.setTaskToEdit(task);
			} else {
				this.setTaskToEdit(null);
			}
			this.setShowTaskModal(true);
		});
	}

	handleCloseTaskModal(): void {
		runInAction(() => {
			this.setShowTaskModal(false);
			this.setTargetSwimlaneId(null);
			this.setTaskToEdit(null);
		});
	}

	async handleSaveCardDetails(cardId: string, updates: { name?: string; description?: string; ownerIds?: string[] }): Promise<void> {
		const originalCard = this.selectedBoard
			?.getSwimlanes()
			.flatMap((l) => l.getTasks())
			.find((t) => t.id === cardId);
		if (!originalCard) return;

		const payload: UpdateTaskPayload = {
			id: cardId,
			name: updates.name,
			description: updates.description,
			swimlaneId: originalCard.getSwimlaneId(),
		};
		const result = await TasksApi.updateTask(payload);
		if (result.isError()) {
			console.error('Falha ao atualizar tarefa:', result.getError());
		} else {
			runInAction(() => {
				if (updates.name) originalCard.setName(updates.name);
				if (updates.description) originalCard.setDescription(updates.description);
				if (updates.ownerIds) originalCard.setOwnerIds(updates.ownerIds);
			});
		}
		this.handleCloseTaskModal();
	}

	handleSaveBoardTitle(onUpdateBoardTitle: (boardId: string, newTitle: string, description?: string) => void, board: Board): void {
		if (!this.editingTitle.trim() || this.editingTitle.trim() === board.getName()) {
			this.setIsEditingTitle(false);
			return;
		}
		onUpdateBoardTitle(board.id!, this.editingTitle.trim(), board.getDescription());
		this.setIsEditingTitle(false);
	}
}

const singleBoardStore = new SingleBoardStore();
export const useSingleBoardStore = () => singleBoardStore;
