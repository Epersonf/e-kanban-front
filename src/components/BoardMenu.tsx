import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface BoardMenuProps {
  boards: { id: number; title: string }[];
  selectedBoardId: number | null;
  onSelect: (id: number) => void;
  onCreate: () => void;
}

const BoardMenu: React.FC<BoardMenuProps> = ({ boards, selectedBoardId, onSelect, onCreate }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside
      style={{
        width: collapsed ? 56 : 240,
        background: '#162447',
        padding: '24px 0',
        borderRight: '1px solid #1f4068',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        color: '#fff',
        transition: 'width 0.2s',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          position: 'absolute',
          top: 16,
          right: -20,
          background: '#1f4068',
          border: 'none',
          borderRadius: '50%',
          width: 32,
          height: 32,
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px #0003',
          zIndex: 3,
        }}
        title={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
      </button>
      {!collapsed && (
        <>
          <div style={{ padding: '0 24px', fontWeight: 'bold', fontSize: 18, marginBottom: 16, color: '#5dade2' }}>
            Boards
          </div>
          {boards.map(board => (
            <button
              key={board.id}
              onClick={() => onSelect(board.id)}
              style={{
                textAlign: 'left',
                padding: '12px 24px',
                background: selectedBoardId === board.id ? '#1f4068' : 'transparent',
                border: 'none',
                borderLeft: selectedBoardId === board.id ? '4px solid #5dade2' : '4px solid transparent',
                color: '#fff',
                fontWeight: selectedBoardId === board.id ? 'bold' : 'normal',
                fontSize: 16,
                cursor: 'pointer',
                transition: 'background 0.2s, border 0.2s'
              }}
            >
              {board.title}
            </button>
          ))}
          <button
            onClick={onCreate}
            style={{ margin: '24px', background: '#5dade2', color: '#fff', border: 'none', borderRadius: 4, padding: '10px 0', fontWeight: 'bold', cursor: 'pointer', fontSize: 16 }}
          >
            + Novo Board
          </button>
        </>
      )}
    </aside>
  );
};

export default BoardMenu;
