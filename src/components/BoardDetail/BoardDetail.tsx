import React, { useMemo, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Board } from '../../models/general/board.model';
import { User } from '../../models/general/user.model';
import { BoardContent } from './BorderDetail.styles';
import { BoardHeader } from '../BoardHeader/BoardHeader';
import { ListContainer } from '../ListContainer';
import TaskModal, { SwimLaneOption } from '../TaskModal/TaskModal';
import { useSingleBoardStore } from '../../stores/boards/single-board.store';

interface BoardDetailProps {
  board: Board;
  onUpdateBoardTitle: (boardId: string, newTitle: string, description?: string) => void;
  onDeleteBoard: (boardIds: string[]) => void;
}

export const BoardDetail: React.FC<BoardDetailProps> = observer(
  ({
    board,
    onUpdateBoardTitle,
    onDeleteBoard,
  }) => {
    const singleBoardStore = useSingleBoardStore();

    // Memoização
    const boardMembers = board.getMembers();
    const membersMap = useMemo(() => {
      const map = new Map<string, User>();
      boardMembers.forEach((member) => map.set(member.id!, member));
      return map;
    }, [boardMembers]);

    // Effects
    useEffect(() => {
      singleBoardStore.setEditingTitle(board.getName());
    }, [board, singleBoardStore]);

    // Handlers
    const handleDeleteBoardClick = () => {
      if (window.confirm(`Tem certeza que deseja excluir o board "${board.getName()}"?`)) {
        onDeleteBoard([board.id!]);
      }
    };

    // Convert swimlanes to options for the task modal
    const swimlaneOptions: SwimLaneOption[] = useMemo(() => {
      return board.getSwimlanes().map(swimlane => ({
        id: swimlane.id!,
        name: swimlane.getName()
      }));
    }, [board]);

    return (
      <BoardContent>
        <BoardHeader
          board={board}
          isEditingTitle={singleBoardStore.isEditingTitle}
          editingTitle={singleBoardStore.editingTitle}
          setEditingTitle={singleBoardStore.setEditingTitle}
          setIsEditingTitle={singleBoardStore.setIsEditingTitle}
          handleSaveBoardTitle={() => singleBoardStore.handleSaveBoardTitle(onUpdateBoardTitle, board)}
          handleDeleteBoardClick={handleDeleteBoardClick}
        />
        <ListContainer
          board={board}
          onOpenTaskModal={(swimlaneId, task) => singleBoardStore.handleOpenTaskModal(swimlaneId, task)}
        />

        {/* Task Modal for creating and editing tasks */}
        <TaskModal
          isOpen={singleBoardStore.showTaskModal}
          onClose={() => singleBoardStore.handleCloseTaskModal()}
          swimlanes={swimlaneOptions}
          taskToEdit={{
            id: singleBoardStore.taskToEdit?.id || '',
            name: singleBoardStore.taskToEdit?.getName() || '',
            description: singleBoardStore.taskToEdit?.getDescription() || '',
            swimlaneId: singleBoardStore.taskToEdit?.getSwimlaneId() || '',
          }}
          boardMembers={Array.from(membersMap.values())}
        />
      </BoardContent>
    );
  }
);
