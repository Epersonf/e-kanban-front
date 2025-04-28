// src/components/common/ContextMenu/ContextMenu.tsx
import React, { useEffect, useRef } from 'react';
import { MenuWrapper } from './ContextMenu.styles';

export interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number } | null; // Coordenadas x, y
  onClose: () => void; // Função para fechar o menu
  children: React.ReactNode; // Os ContextMenuItems
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  onClose,
  children,
}) => {
  const menuRef = useRef<HTMLDivElement>(null); // Ref para o elemento do menu

  // Efeito para detectar cliques fora do menu
  useEffect(() => {
    if (!isOpen) return; // Só executa se o menu estiver aberto

    const handleClickOutside = (event: MouseEvent) => {
      // Verifica se o clique foi fora do elemento referenciado pelo menuRef
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose(); // Chama a função de fechar passada por prop
      }
    };

    // Adiciona o listener ao montar/abrir
    document.addEventListener('mousedown', handleClickOutside);

    // Remove o listener ao desmontar/fechar
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]); // Depende de isOpen e onClose

  // Efeito para detectar a tecla Escape (opcional, mas bom para UX)
  useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
              onClose();
          }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
          document.removeEventListener('keydown', handleKeyDown);
      };
  }, [isOpen, onClose]);


  if (!isOpen || !position) {
    return null; // Não renderiza nada se fechado ou sem posição
  }

  return (
    // Renderiza o wrapper na posição correta, passando a ref
    <MenuWrapper ref={menuRef} top={position.y} left={position.x}>
      {children}
    </MenuWrapper>
  );
};