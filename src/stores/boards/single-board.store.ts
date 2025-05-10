import { makeAutoObservable, computed, runInAction } from 'mobx';
import { Board } from '../../models/general/board.model';
import { Task } from '../../models/general/task.model';
import { useBoardsStore } from './boards.store';
import { TasksApi, UpdateTaskPayload } from '../../infra/api/tasks.api';

export class SingleBoardStore {
	selectedBoardId: string | null = null;
	isEditingTitle = false;
	editingTitle = '';
	showTaskModal = false;
	targetSwimlaneId: string | null = null;
	taskToEdit: Task | null = null;

	boardStore = useBoardsStore();

	constructor() {
		makeAutoObservable(this);
	}

	get selectedBoard(): Board | null {
		if (!this.selectedBoardId) return null;
		return this.boardStore.boards.find(b => b.id === this.selectedBoardId) || null;
	}

	setSelectedBoardId(id: string | null): void {
		this.selectedBoardId = id;
		this.isEditingTitle = false;
		this.editingTitle = '';
		this.showTaskModal = false;
		this.targetSwimlaneId = null;
		this.taskToEdit = null;
	}

	setEditingTitle(value: string): void {
		this.editingTitle = value;
	}

	setIsEditingTitle(value: boolean): void {
		this.isEditingTitle = value;
		if (!value && this.selectedBoard) {
			this.editingTitle = this.selectedBoard.getName();
		}
	}

	setShowTaskModal(value: boolean): void {
		this.showTaskModal = value;
	}

	setTargetSwimlaneId(value: string | null): void {
		this.targetSwimlaneId = value;
	}

	setTaskToEdit(task: Task | null): void {
		this.taskToEdit = task;
	}

	setBoard(board: Board | null): void {
		this.selectedBoardId = board?.id ?? null;
		this.editingTitle = board?.getName() ?? '';
	}

	handleOpenTaskModal(swimlaneId: string, task?: Task): void {
		this.setTargetSwimlaneId(swimlaneId);
		this.setTaskToEdit(task ?? null);
		this.setShowTaskModal(true);
	}

	handleCloseTaskModal(): void {
		this.setShowTaskModal(false);
		this.setTargetSwimlaneId(null);
		this.setTaskToEdit(null);
	}

updateTaskInSelectedBoard(updatedTask: Task) {
  runInAction(() => {
		if (!this.selectedBoard) return;
    const swimlane = this.selectedBoard.swimlanes.find(sl => sl.id === updatedTask.swimlaneId);
    if (swimlane) {
      const taskIndex = swimlane.tasks.findIndex(t => t.id === updatedTask.id);
      if (taskIndex !== -1) {
        swimlane.tasks[taskIndex] = updatedTask;
      } else {
        swimlane.tasks.push(updatedTask);
      }
    }
  });
}

	updateTaskInBoard(updatedTask: Task | null): void {
		if (!updatedTask || !this.selectedBoard) return;

		const swimlane = this.selectedBoard
			.getSwimlanes()
			.find(sl => sl.getTasks().some(t => t.id === updatedTask.id));
		if (!swimlane) return;

		const index = swimlane.getTasks().findIndex(t => t.id === updatedTask.id);
		if (index === -1) return;

		swimlane.getTasks()[index] = new Task({
			id: updatedTask.id!,
			createdAtUtc: updatedTask.createdAtUtc || new Date(),
			updatedAtUtc: updatedTask.updatedAtUtc || new Date(),
			name: updatedTask.getName(),
			description: updatedTask.getDescription() || '',
			swimlaneId: updatedTask.getSwimlaneId(),
			ownerIds: updatedTask.getOwnerIds() || [],
		});
	}

	handleSaveBoardTitle(
		onUpdateBoardTitle: (boardId: string, newTitle: string, description?: string) => void,
		board: Board
	): void {
		const trimmed = this.editingTitle.trim();
		if (!trimmed || trimmed === board.getName()) {
			this.setIsEditingTitle(false);
			return;
		}
		onUpdateBoardTitle(board.id!, trimmed, board.getDescription());
		this.setIsEditingTitle(false);
	}
}

const singleBoardStore = new SingleBoardStore();
export const useSingleBoardStore = () => singleBoardStore;
