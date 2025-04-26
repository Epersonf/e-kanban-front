// src/components/CardDetailsModal.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../models/general/task.model';
import { User } from '../models/general/user.model'; // Importar User

// Remover interfaces não utilizadas
// import { MemberType, CardType } from './Card';

interface CardDetailsModalProps {
  card: Task;
  boardMembers: User[]; // <-- Recebe todos os membros do board
  isOpen: boolean;
  onClose: () => void;
  // Atualizado para passar ID e objeto de updates
  onSave: (cardId: string, updates: { name?: string; description?: string; ownerIds?: string[] }) => void;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  card,
  boardMembers, // <-- Usar membros do board
  isOpen,
  onClose,
  onSave
}) => {
  // --- State ---
  // Inicializar com os dados do 'card' recebido via prop
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedOwnerIds, setSelectedOwnerIds] = useState<string[]>([]);

  // Sincronizar estado interno quando o 'card' da prop mudar (ou ao abrir)
  useEffect(() => {
    if (isOpen && card) {
      setName(card.getName());
      setDescription(card.getDescription() ?? '');
      setSelectedOwnerIds(card.getOwnerIds() ?? []);
    }
    // Resetar pode ser feito no onClose se necessário, mas assim
    // garante que sempre mostre os dados do 'card' atual ao abrir.
  }, [card, isOpen]);


  // --- Handlers ---
  // Adiciona ou remove um ID da lista de selecionados
  const handleOwnerToggle = useCallback((ownerId: string) => {
    setSelectedOwnerIds(prevIds =>
      prevIds.includes(ownerId)
        ? prevIds.filter(id => id !== ownerId) // Remove
        : [...prevIds, ownerId] // Adiciona
    );
  }, []);

  // Verifica se houve mudanças antes de salvar (otimização opcional)
  const detectChanges = useCallback(() => {
    const initialOwners = card.getOwnerIds() ?? [];
    const nameChanged = name !== card.getName();
    const descriptionChanged = description !== (card.getDescription() ?? '');
    const ownersChanged =
      selectedOwnerIds.length !== initialOwners.length ||
      !selectedOwnerIds.every(id => initialOwners.includes(id));

    const updates: { name?: string; description?: string; ownerIds?: string[] } = {};
    if (nameChanged) updates.name = name;
    if (descriptionChanged) updates.description = description; // Salva '' se foi limpo
    if (ownersChanged) updates.ownerIds = selectedOwnerIds;

    return updates;
  }, [name, description, selectedOwnerIds, card]);


  const handleSaveClick = useCallback(() => {
      const updates = detectChanges();
      // Só chama onSave se houver mudanças reais
      if (Object.keys(updates).length > 0) {
          onSave(card.id!, updates);
      } else {
          onClose(); // Fecha mesmo se não houver mudanças
      }
  }, [card, onSave, onClose, detectChanges]); // Incluir detectChanges


  // --- Rendering ---
  if (!isOpen || !card) return null;

  // Encontra os objetos User dos selecionados para exibição
  const selectedOwners = boardMembers.filter(member => selectedOwnerIds.includes(member.id!));

  return (
    // Container do Modal (Fundo escuro)
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(9, 30, 66, 0.7)', // Fundo translúcido
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000, // Garante que fique sobre outros elementos
      fontFamily: '"-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    }}>
      {/* Conteúdo do Modal */}
      <div style={{
        background: '#f4f5f7', // Fundo claro padrão Trello
        borderRadius: '3px',
        padding: '24px',
        minWidth: '450px', // Largura mínima
        maxWidth: '600px', // Largura máxima
        color: '#172b4d', // Cor de texto principal
        boxShadow: '0 8px 16px -4px rgba(9, 30, 66, 0.25), 0 0 0 1px rgba(9, 30, 66, 0.08)',
        position: 'relative', // Para o botão fechar
        display: 'flex',
        flexDirection: 'column',
        gap: '16px', // Espaçamento entre seções
      }}>
        {/* Cabeçalho com Título e Botão Fechar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            {/* Pode mostrar o nome atual aqui ou um título genérico */}
            {card.getName()}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b778c', fontSize: '24px', cursor: 'pointer', padding: '4px', lineHeight: 1 }} title="Fechar">×</button>
        </div>

        {/* Campo Título */}
        <div>
          <label style={{ fontWeight: 600, fontSize: '12px', color: '#5e6c84', display: 'block', marginBottom: '4px' }}>Título</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '3px', border: '1px solid #dfe1e6', background: '#fff', color: '#172b4d', fontSize: '14px' }}
            placeholder="Adicione um título..."
          />
        </div>

        {/* Campo Descrição */}
        <div>
          <label style={{ fontWeight: 600, fontSize: '12px', color: '#5e6c84', display: 'block', marginBottom: '4px' }}>Descrição</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '3px', border: '1px solid #dfe1e6', background: '#fff', color: '#172b4d', fontSize: '14px', resize: 'vertical' }}
            placeholder="Adicione uma descrição mais detalhada..."
          />
        </div>

        {/* Seção Proprietários (Membros) */}
        <div>
          <label style={{ fontWeight: 600, fontSize: '12px', color: '#5e6c84', display: 'block', marginBottom: '8px' }}>Proprietários</label>

          {/* Exibe os proprietários selecionados */}
          {selectedOwners.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {selectedOwners.map(owner => (
                <div key={owner.id} style={{ display: 'flex', alignItems: 'center', background: '#dfe1e6', borderRadius: '3px', padding: '4px 8px' }}>
                   <img
                    //  src={owner.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.getName())}&background=random&size=20`}
                     alt={owner.getName()}
                     title={owner.getName()}
                     style={{ width: 20, height: 20, borderRadius: '50%', marginRight: '6px' }}
                    />
                   <span style={{ fontSize: '12px', fontWeight: 500 }}>{owner.getName()}</span>
                   {/* Botão para remover rapidamente (opcional) */}
                   <button onClick={() => handleOwnerToggle(owner.id!)} style={{ marginLeft: '6px', background: 'none', border: 'none', color: '#6b778c', cursor: 'pointer', fontSize: '14px' }} title="Remover">×</button>
                </div>
              ))}
            </div>
          )}

          {/* Lista para selecionar/desselecionar membros */}
          <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #dfe1e6', borderRadius: '3px', padding: '8px' }}>
             {boardMembers.length > 0 ? boardMembers.map(member => (
                <div key={member.id} style={{ display: 'flex', alignItems: 'center', padding: '4px 0', cursor: 'pointer' }} onClick={() => handleOwnerToggle(member.id!)}>
                    <input
                        type="checkbox"
                        checked={selectedOwnerIds.includes(member.id!)}
                        onChange={() => handleOwnerToggle(member.id!)} // Permite clicar no checkbox também
                        style={{ marginRight: '8px', cursor: 'pointer' }}
                        id={`member-${member.id}`} // Para associar label se necessário
                    />
                    <img
                        // src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.getName())}&background=random&size=24`}
                        alt={member.getName()}
                        style={{ width: 24, height: 24, borderRadius: '50%', marginRight: '8px' }}
                    />
                    <label htmlFor={`member-${member.id}`} style={{ fontSize: '14px', cursor: 'pointer' }}>
                       {member.getName()} {member.surname ? ` ${member.surname}`: ''} {/* Exibe nome e sobrenome */}
                    </label>
                </div>
            )) : (
                <span style={{fontSize: '12px', color: '#5e6c84'}}>Nenhum membro neste quadro.</span>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button
            onClick={onClose}
            style={{ background: '#f4f5f7', color: '#172b4d', border: 'none', borderRadius: '3px', padding: '8px 16px', fontWeight: 500, cursor: 'pointer', fontSize: '14px' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dfe1e6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f4f5f7'}
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveClick}
            style={{ background: '#0079bf', color: '#fff', border: 'none', borderRadius: '3px', padding: '8px 16px', fontWeight: 500, cursor: 'pointer', fontSize: '14px' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#026aa7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0079bf'}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal;