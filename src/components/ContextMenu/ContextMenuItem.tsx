// src/components/common/ContextMenu/ContextMenuItem.tsx
import React from 'react';
import { MenuItemButton } from './ContextMenu.styles';

export interface ContextMenuItemProps {
  onClick?: () => void;
  disabled?: boolean;
  isDestructive?: boolean; // Para ações como "Excluir"
  icon?: React.ReactNode; // Ícone opcional
  children: React.ReactNode; // Texto do item
}

export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  onClick,
  disabled = false,
  isDestructive = false,
  icon,
  children,
}) => {
  return (
    <MenuItemButton
      onClick={onClick}
      disabled={disabled}
      isDestructive={isDestructive}
      type="button" // Garante que não submeta formulários
    >
      {icon}
      {children}
    </MenuItemButton>
  );
};