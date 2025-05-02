import { observer } from "mobx-react";
import { Button, Card, CardContainer, Container, EditableCard, EditableTitle, Header, StaticTitle } from "./styles";
import { Swimlane } from "../../models/general/swimlane.model";
import { createRef, useCallback, useEffect, useState, useRef } from "react";
import { SwimlanesApi } from "../../infra/api/swimlanes.api";
import { observable, runInAction } from "mobx";
import { TasksApi } from "../../infra/api/tasks.api";
import { TaskData, useUpdateSwimlanesStore } from "../../stores/swinlane/update.swimlanes";

// Interface para o estado armazenado no Ref
interface DraggingState {
  offsetX: number;
  offsetY: number;
  initialX: number; // Posição inicial do mouse no viewport
  initialY: number; // Posição inicial do mouse no viewport
  elementStartX: number; // Posição inicial do elemento
  elementStartY: number; // Posição inicial do elemento
  originalParent: HTMLElement;
  originalIndex: number;
  elementWidth: number;
  elementHeight: number;
}

interface ListProps {
  swimlane: Swimlane;
  onDelete?: (id: string) => void;
}

export const List: React.FC<ListProps> = observer(({
  swimlane,
  onDelete
}) => {
  const updateSwimlaneStore = useUpdateSwimlanesStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Usar observable do MobX para a lista de tasks
  // const [tasks] = useState<TaskData[]>(() => observable([]));
  const textAreaRef = createRef<HTMLTextAreaElement>();

  // Usar useRef para o estado de arraste que não precisa causar re-renderizações por si só
  const draggingStateRef = useRef<DraggingState | null>(null);

  const handleAddTask = async () => {
    setIsAddingTask(false);
    const textValue = textAreaRef.current?.value;
    if (textValue) {
      try {
        const res = await TasksApi.createTask({
          name: textValue,
          swimlaneId: swimlane.id!,
          description: ' ', // Ou deixe o usuário definir
          order: updateSwimlaneStore.getSwimlaneTasks(swimlane.id!).length // Adiciona ao final por padrão
        });

        if (res.isError()) {
          console.error("Erro ao criar task:", res.getError());
          return;
        }

        const createdTasks = res.getValue();
        if (createdTasks && createdTasks.length > 0) {
          const newTask = createdTasks[0];
          const card: TaskData = {
            id: newTask.id!,
            text: newTask.getName(),
            ref: createRef<HTMLDivElement>() // Cria uma nova ref para o novo card
          };
          updateSwimlaneStore.addSwimlaneTask(swimlane.id!, card);
        }
      } catch (error) {
        console.error("Exceção ao criar task:", error);
      }
    }
  }

  const handleEditTitle = () => {
    setIsEditingTitle(!isEditingTitle);
    // Adicionar lógica para salvar o título editado aqui
  };

  const startAddingTask = () => {
    setIsAddingTask(true);
    // Focar no textarea quando ele aparecer
    setTimeout(() => textAreaRef.current?.focus(), 0);
  };

  const cancelAddingTask = () => {
    setIsAddingTask(false);
  };

  const onDeleteList = async (swimlaneId: string) => {
    // Adicionar confirmação aqui seria uma boa prática
    try {
      const res = await SwimlanesApi.deleteSwimlane(swimlaneId);
      if (res.isError()) {
        console.error("Erro ao deletar swimlane:", res.getError());
        return;
      }
      // Notifica o componente pai para remover da UI
      onDelete && onDelete(swimlane.id!);
    } catch (error) {
      console.error("Exceção ao deletar swimlane:", error);
    }
  }

  const onDropTask = () => {
    const task = updateSwimlaneStore.getTaskToDrag();
    if (task && task.originalSwimlaneId !== swimlane.id) {
      console.log("Drop task:", task);
      updateSwimlaneStore.removeSwimlaneTask(task.originalSwimlaneId!, task);
      updateSwimlaneStore.addSwimlaneTask(swimlane.id!, task);
    }
  }

  // --- Lógica de Drag and Drop ---

  const cleanupDrag = useCallback(() => {
    const taskToDrag = updateSwimlaneStore.getTaskToDrag();
    const currentDraggingState = draggingStateRef.current; // Pega o estado atual do ref

    // console.log("Cleanup - Task:", taskToDrag, "State:", currentDraggingState);

    if (taskToDrag?.ref.current && currentDraggingState) {
      const cardElement = taskToDrag.ref.current;

      // Retorna o elemento para o DOM original se ele foi movido para o body
      if (cardElement.parentElement === document.body) {
        const referenceNode = currentDraggingState.originalParent.children[currentDraggingState.originalIndex];
        if (referenceNode) {
          currentDraggingState.originalParent.insertBefore(cardElement, referenceNode);
        } else {
          currentDraggingState.originalParent.appendChild(cardElement);
        }
      }

      // Reseta os estilos inline aplicados durante o arraste
      cardElement.style.pointerEvents = '';
      cardElement.style.position = '';
      cardElement.style.width = '';
      cardElement.style.height = '';
      cardElement.style.transform = '';
      cardElement.style.opacity = '';
      cardElement.style.zIndex = '';
      cardElement.style.left = '';
      cardElement.style.top = '';
      cardElement.style.boxSizing = ''; // Resetar se foi alterado

      updateSwimlaneStore.setIsInserting(false);
      updateSwimlaneStore.setTaskToDrag(null);
    }

    // Limpa o ref do estado de arraste independentemente de ter movido ou não
    draggingStateRef.current = null;

  }, [updateSwimlaneStore]); // Não depende mais do useState draggingState

  const onMouseDownTask = (e: React.MouseEvent<HTMLDivElement>, task: TaskData) => {
    // Previne seleção de texto acidental durante o arraste
    e.preventDefault();

    const cardElement = task.ref.current;
    if (!cardElement) return;

    // Pega a referência ao elemento pai real (CardContainer)
    const parentElement = cardElement.parentElement;
    if (!parentElement) return;


    const rect = cardElement.getBoundingClientRect();

    // Calcula o índice original corretamente dentro do pai
    const originalIndex = Array.from(parentElement.children).indexOf(cardElement);

    // Inicia o estado de arraste no Ref
    draggingStateRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      initialX: e.clientX,
      initialY: e.clientY,
      elementStartX: rect.left,
      elementStartY: rect.top,
      originalParent: parentElement, // Armazena o pai real
      originalIndex: originalIndex, // Armazena o índice correto
      elementWidth: rect.width,
      elementHeight: rect.height
    };

    // Define a task sendo arrastada no store
    runInAction(() => {
      updateSwimlaneStore.setTaskToDrag(task);
      // Não precisa setar isInserting aqui, o mousemove fará isso quando o movimento começar
    });

    // console.log("MouseDown - Initial State:", draggingStateRef.current);
  };

  // Efeito para adicionar/remover listeners globais de mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Só processa se uma task estiver selecionada para drag
      const taskToDrag = updateSwimlaneStore.getTaskToDrag();
      if (!taskToDrag || !taskToDrag.ref.current) return;

      const cardElement = taskToDrag.ref.current;
      let currentDraggingState = draggingStateRef.current;

      // Se o estado de arraste ainda não foi totalmente inicializado (primeiro movimento real)
      if (currentDraggingState && !updateSwimlaneStore.getIsInserting()) {
        // Verifica um pequeno threshold para evitar ativar o drag em cliques simples
        const dx = e.clientX - currentDraggingState.initialX;
        const dy = e.clientY - currentDraggingState.initialY;
        if (Math.sqrt(dx * dx + dy * dy) < 5) { // Threshold de 5 pixels
          return;
        }

        // console.log("MouseMove - Drag Start Detected");

        // Marca que o arraste realmente começou (para aplicar estilos visuais)
        runInAction(() => {
          updateSwimlaneStore.setIsInserting(true);
        });

        // Aplica estilos de "arrastando"
        cardElement.style.pointerEvents = "none"; // Importante para eventos mouseover em outros elementos funcionarem
        cardElement.style.position = "fixed"; // Usar fixed para posicionamento relativo ao viewport
        cardElement.style.zIndex = "1000"; // Garante que fique por cima
        cardElement.style.width = `${currentDraggingState.elementWidth}px`;
        cardElement.style.height = `${currentDraggingState.elementHeight}px`;
        cardElement.style.transform = "rotate(3deg)"; // Pequena rotação para feedback visual
        cardElement.style.opacity = "0.9";
        cardElement.style.boxSizing = "border-box";

        // Move o elemento para o body para evitar problemas com overflow/scroll dos pais
        // (Opcional, mas comum. Se não usar, position:absolute pode ser suficiente)
        // document.body.appendChild(cardElement); // Descomente se quiser mover para o body

        // Atualiza a posição inicial baseada no primeiro movimento real
        cardElement.style.left = `${e.clientX - currentDraggingState.offsetX}px`;
        cardElement.style.top = `${e.clientY - currentDraggingState.offsetY}px`;

      } else if (currentDraggingState && updateSwimlaneStore.getIsInserting()) {
        // console.log("MouseMove - Dragging");
        // Atualiza a posição do elemento enquanto arrasta
        cardElement.style.left = `${e.clientX - currentDraggingState.offsetX}px`;
        cardElement.style.top = `${e.clientY - currentDraggingState.offsetY}px`;

        // Aqui você adicionaria a lógica para detectar sobre qual lista/posição soltar
        // (placeholder/highlighting) - Fora do escopo da correção inicial.
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      // console.log("MouseUp triggered");
      // Se estava arrastando algo, limpa tudo
      if (updateSwimlaneStore.getTaskToDrag()) {
        // Aqui você adicionaria a lógica para efetivar o drop na nova posição/lista
        // antes de limpar. Ex: chamar API para salvar a nova ordem/swimlane.

        cleanupDrag();
      }
    };

    // Adiciona listeners globais
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Função de limpeza do efeito: remove os listeners
    return () => {
      // console.log("Removing mouse listeners");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      // Garante a limpeza se o componente for desmontado durante um drag
      if (draggingStateRef.current) {
        cleanupDrag();
      }
    };
    // Dependências: store, cleanup e a lista de tasks (para cálculo de índice inicial)
  }, [updateSwimlaneStore, cleanupDrag]);

  // Efeito para carregar tasks iniciais da swimlane
  useEffect(() => {
    const initialTasks: TaskData[] = swimlane.getTasks()?.map((task) => ({
      id: task.id!,
      text: task.name,
      ref: createRef<HTMLDivElement>(), // Cria ref para cada task existente
      originalSwimlaneId: swimlane.id
    })) || [];

    updateSwimlaneStore.setSwimlane([{ tasks: initialTasks, id: swimlane.id! }]);
  }, [swimlane, updateSwimlaneStore]); // Depende da swimlane e da referência ao array tasks

  return (
    <Container onMouseUp={onDropTask} $isInsertingCard={updateSwimlaneStore.getIsInserting()} key={swimlane.id}>
      <Header>
        {isEditingTitle ? (
          <EditableTitle
            defaultValue={swimlane.name}
            onBlur={() => setIsEditingTitle(false)} // Salvar em onBlur ou Enter
            // onKeyDown={(e) => { if (e.key === 'Enter') { /* save */ setIsEditingTitle(false); } }}
            autoFocus
          />
        ) : (
          <StaticTitle onClick={handleEditTitle}>{swimlane.name}</StaticTitle>
        )}
        <Button style={{ width: '30px', height: '30px', padding: '0px' }} onClick={() => onDeleteList(swimlane.id || '')} title="Excluir lista">✕</Button>
      </Header>
      {/* Container onde os cards são renderizados e onde o drop pode ocorrer */}
      <CardContainer>
        {updateSwimlaneStore.getSwimlaneTasks(swimlane.id!).map((task) => (
          <Card
            key={task.id}
            ref={task.ref}
            // Aplica estilo de "ghost" se esta for a task sendo arrastada E o drag começou
            $isDragging={updateSwimlaneStore.getTaskToDrag()?.id === task.id && updateSwimlaneStore.getIsInserting()}
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => onMouseDownTask(e, task)}
          // REMOVIDO: onMouseUp={cleanupDrag} - o listener global cuida disso
          >
            {task.text}
          </Card>
        ))}
        {/* Placeholder para adicionar novo cartão */}
        {isAddingTask && (
          <EditableCard
            ref={textAreaRef}
            placeholder="Insira um título para este cartão..."
            onBlur={handleAddTask} // Adiciona ao perder foco
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Evita nova linha no textarea
                handleAddTask();
              } else if (e.key === 'Escape') {
                cancelAddingTask();
              }
            }}
          />
        )}
      </CardContainer>
      {isAddingTask ? (
        <div style={{ display: "flex", gap: "4px" }}>
          <Button style={{ backgroundColor: "#579DFF", color: "#222", fontWeight: "bold", borderRadius: "3px" }} onClick={handleAddTask}>Adicionar Cartão</Button>
          <Button style={{ width: '31px', height: '31px', padding: '0px' }} onClick={cancelAddingTask}>✕</Button>
        </div>
      ) : (
        <Button onClick={startAddingTask}>+ Adicionar Cartão</Button>
      )}
    </Container>
  );
});