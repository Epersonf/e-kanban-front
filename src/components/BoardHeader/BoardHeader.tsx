import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { Board } from '../../models/general/board.model';
import { BoardTitle, BoardTitleArea, DeleteButton, EditButton, TitleInput } from '../BoardDetail/BorderDetail.styles';
import { LeftSide, Perfil, RightSide } from './BoardHeader.styles';

interface BoardHeaderProps {
  board: Board;
  isEditingTitle: boolean;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  setIsEditingTitle: (isEditing: boolean) => void;
  handleSaveBoardTitle: () => void;
  handleDeleteBoardClick: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  board,
  isEditingTitle,
  editingTitle,
  setEditingTitle,
  setIsEditingTitle,
  handleSaveBoardTitle,
  handleDeleteBoardClick,
}) => (
  <BoardTitleArea>
    <LeftSide>
      {isEditingTitle ? (
        <TitleInput
          value={editingTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTitle(e.target.value)}
          onBlur={handleSaveBoardTitle}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') handleSaveBoardTitle();
            if (e.key === 'Escape') {
              setEditingTitle(board.getName());
              setIsEditingTitle(false);
            }
          }}
          autoFocus
        />
      ) : (
        <BoardTitle>{board.getName()}</BoardTitle>
      )}
      <EditButton onClick={() => setIsEditingTitle(true)}>
        <FiEdit />
      </EditButton>
      <DeleteButton onClick={handleDeleteBoardClick}>Excluir</DeleteButton>
    </LeftSide>
    <RightSide>
      <Perfil>RS</Perfil>
      <Perfil>JG</Perfil>
      <Perfil>EF</Perfil>
    </RightSide>
  </BoardTitleArea>
);