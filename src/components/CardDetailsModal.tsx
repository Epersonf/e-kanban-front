import React, { useState } from 'react';
import { MemberType, CardType } from './Card';

interface CardDetailsModalProps {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: CardType) => void;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ card, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [members, setMembers] = useState<MemberType[]>(card.members || []);
  const [memberInput, setMemberInput] = useState('');

  if (!isOpen) return null;

  const handleAddMember = () => {
    const name = memberInput.trim();
    if (!name) return;
    setMembers(prev => [
      ...prev,
      { id: Date.now(), name }
    ]);
    setMemberInput('');
  };

  const handleRemoveMember = (id: number) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleSave = () => {
    onSave({ ...card, title, description, members });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#162447', borderRadius: 8, padding: 32, minWidth: 350, maxWidth: 420, color: '#fff', boxShadow: '0 4px 24px #0005', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }} title="Fechar">×</button>
        <h2 style={{ margin: '0 0 12px 0' }}>Detalhes do Cartão</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Título</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #5dade2', marginTop: 4, background: '#1f4068', color: '#fff' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Descrição</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #5dade2', marginTop: 4, background: '#1f4068', color: '#fff', resize: 'vertical' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 'bold' }}>Membros</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, marginBottom: 8 }}>
            {members.map(member => (
              <span key={member.id} style={{ display: 'flex', alignItems: 'center', background: '#5dade2', borderRadius: 16, padding: '2px 10px', fontSize: 14 }}>
                <img src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`} alt={member.name} style={{ width: 22, height: 22, borderRadius: '50%', marginRight: 6 }} />
                {member.name}
                <button onClick={() => handleRemoveMember(member.id)} style={{ marginLeft: 6, background: 'none', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }} title="Remover">×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={memberInput}
              onChange={e => setMemberInput(e.target.value)}
              placeholder="Nome do membro"
              style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #5dade2', background: '#1f4068', color: '#fff' }}
              onKeyDown={e => { if (e.key === 'Enter') handleAddMember(); }}
            />
            <button onClick={handleAddMember} style={{ background: '#5dade2', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', fontWeight: 'bold', cursor: 'pointer' }}>Adicionar</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ background: '#1f4068', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleSave} style={{ background: '#5dade2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsModal;
