// src/stores/single-board.store.ts
import { makeAutoObservable, computed, runInAction } from 'mobx';
import boardsStore from './boards.store'; // Importar a store principal
import { Board } from '../models/general/board.model';

export class SingleBoardStore {
    selectedBoardId: string | null = null;
    // loading/error próprios não são mais necessários aqui para buscar o board
    // mas podem ser úteis se houver ações *específicas* do single board no futuro

    constructor() {
        makeAutoObservable(this, {
            selectedBoard: computed // Derivar o board da store principal
        });
    }

    setSelectedBoardId(id: string | null): void {
        // Se o ID for o mesmo, não faz nada (evita re-renders desnecessários)
        // if (id === this.selectedBoardId) return;
        runInAction(() => {
            this.selectedBoardId = id;
        })
    }

    // Computed property para obter o board completo
    get selectedBoard(): Board | null {
        if (!this.selectedBoardId) {
            return null;
        }
        // Encontra o board na store principal
        const board = boardsStore.boards.find(b => b.id === this.selectedBoardId);
        // console.log(`Computed selectedBoard for ID ${this.selectedBoardId}:`, board ? board.getName() : 'Not found');
        return board || null;
    }

    // O método setBoard pode ser mantido se houver casos de uso para definir
    // um board diretamente, mas seu uso primário agora é via setSelectedBoardId.
    setBoard(board: Board | null): void {
        // console.log("Setting board directly:", board?.getName());
         runInAction(() => {
           this.selectedBoardId = board?.id ?? null;
         });
         // Opcional: Adicionar/atualizar em boardsStore se necessário (ver sugestão original)
    }

   // Remover fetchBoard - não busca mais aqui
   // async fetchBoard(ids: string[]): Promise<void> { ... }
}

const singleBoardStore = new SingleBoardStore();
export default singleBoardStore;