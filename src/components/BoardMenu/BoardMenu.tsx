import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import {
  SidebarContainer,
  ToggleButton,
  MenuContent,
  MenuHeader,
  BoardItem,
  NewBoardButton
} from './BoardMenu.styles';

export interface BoardMenuProps {
  boards: { id: string; title: string }[];
  selectedBoardId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onUpdate: () => void;
}

const BoardMenu: React.FC<BoardMenuProps> = ({
  boards,
  selectedBoardId,
  onSelect,
  onCreate,
  onUpdate,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (collapsed) {
      setCollapsed(false);
    }
  }, [boards]);

  return (
    // Renderiza o container passando a prop 'collapsed'
    <SidebarContainer $collapsed={collapsed}>
      {/* Botão de toggle */}
      <ToggleButton
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
      </ToggleButton>

      {/* Renderiza o conteúdo apenas se não estiver colapsado */}
      {!collapsed && (
        <MenuContent>
          <MenuHeader>Boards</MenuHeader>
          {boards.map(board => (
            // Renderiza cada item de board, passando 'isSelected'
            <BoardItem
              key={board.id}
              onClick={() => onSelect(board.id)}
              $isSelected={selectedBoardId === board.id}
            >
              {board.title}
            </BoardItem>
          ))}
          {/* Botão de novo board */}
          <NewBoardButton onClick={onCreate}
          onChange={onUpdate}
          >
            + Novo Board
          </NewBoardButton>
        </MenuContent>
      )}
    </SidebarContainer>
  );
};

export default BoardMenu;