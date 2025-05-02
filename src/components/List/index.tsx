import { observer } from "mobx-react";
import { Button, Card, CardContainer, Container, EditableCard, EditableTitle, Header, StaticTitle } from "./styles";
import { Swimlane } from "../../models/general/swimlane.model";
import { createRef, RefObject, useCallback, useEffect, useState } from "react";
import { SwimlanesApi } from "../../infra/api/swimlanes.api";
import { observable, runInAction } from "mobx";
import { TasksApi } from "../../infra/api/tasks.api";

interface TaskData {
  id: string;
  text: string;
  ref: RefObject<HTMLDivElement | null>;
}

interface DraggingState {
  offsetX: number;
  offsetY: number;
  oldParent: HTMLElement;
  oldIndex: number;
}

interface ListProps {
  swimlane: Swimlane
  onDelete?: (id: string) => void;
}

export const List: React.FC<ListProps> = observer(({
  swimlane,
  onDelete
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const [tasks] = useState<TaskData[]>(() => observable([]));
  const textAreaRef = createRef<HTMLTextAreaElement>();

  const [taskToDrag, setTaskToDrag] = useState<TaskData | null>(null);
  const [draggingState, setDraggingState] = useState<null | DraggingState>(null);

  const handleAddTask = () => {
    setIsAddingTask(false);
    if (textAreaRef.current && textAreaRef.current.value) {
      runInAction(async () => {
        const res = await TasksApi.createTask({
          name: textAreaRef.current!.value,
          swimlaneId: swimlane.id!,
          description: ' ',
        });
        console.log(res);
        if (res.isError()) return;

        const values = res.getValue()!;

        console.log(values);

        const card: TaskData = {
          id: values[0].id!,
          text: values[0].getName(),
          ref: createRef<HTMLDivElement>()
        }

        tasks.push(card);
      })
    }
  }

  const onMouseDownTask = (card: TaskData) => {
    setTaskToDrag(card);
  }

  const handleEditTitle = () => {
    setIsEditingTitle(!isEditingTitle);
  };

  const startAddingTask = () => {
    setIsAddingTask(true);
  };

  const cancelAddingTask = () => {
    setIsAddingTask(false);
  };

  const onDeleteList = async (swimlaneId: string) => {
    const res = await SwimlanesApi.deleteSwimlane(swimlaneId);
    if (res.isError()) return;

    onDelete && onDelete(swimlane.id!);
  }

  const cleanupDrag = useCallback(() => {
    if (taskToDrag?.ref.current && draggingState) {
      const cardElement = taskToDrag.ref.current;

      const referenceNode = draggingState.oldParent.children[draggingState.oldIndex];

      if (cardElement.parentElement === document.body) {
        if (referenceNode) {
          draggingState.oldParent.insertBefore(cardElement, referenceNode);
        } else {
          draggingState.oldParent.appendChild(cardElement);
        }
      }
      cardElement.style.position = '';
      cardElement.style.width = '';
      cardElement.style.height = '';
      cardElement.style.transform = '';
      cardElement.style.opacity = '';
      cardElement.style.zIndex = '';
      cardElement.style.left = '';
      cardElement.style.top = '';
      cardElement.style.pointerEvents = '';
      cardElement.style.boxSizing = '';
    }

    setTaskToDrag(null);
    setDraggingState(null);
  }, [taskToDrag, draggingState]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (taskToDrag) {
        if (!draggingState) {
          const card = taskToDrag.ref.current;
          if (card) {
            const rect = card.getBoundingClientRect();
            console.log(rect);

            setDraggingState({
              offsetX: e.offsetX,
              offsetY: e.offsetY,
              oldParent: card.parentElement || document.body,
              oldIndex: tasks.indexOf(taskToDrag)
            });

            card.style.position = "absolute";
            card.style.width = `${rect.width - 20}px`;
            card.style.height = `${rect.height - 20}px`;
            card.style.transform = "rotate(5deg)";
            card.style.opacity = "0.8";
            document.body.appendChild(card);
          }
        } else {
          const card = taskToDrag.ref.current;
          if (card) {
            card.style.left = `${e.clientX - draggingState.offsetX}px`;
            card.style.top = `${e.clientY - draggingState.offsetY}px`;
          }
        }
      }
    }

    const handleMouseUp = () => {
      cleanupDrag();
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
  }, [taskToDrag, draggingState, tasks, cleanupDrag]);

  useEffect(() => {
    const newTasks: TaskData[] = swimlane.getTasks()?.map((task) => {
      return {
        id: task.id,
        text: task.name,
        ref: createRef<HTMLDivElement>(),
      } as TaskData;
    }) || [];

    runInAction(() => {
      tasks.push(...newTasks);
    });

    return () => {
      tasks.length = 0;
    }
  }, [swimlane, tasks]);

  return (
    <Container key={swimlane.id}>
      <Header>
        {isEditingTitle ? (
          <EditableTitle>{swimlane.name}</EditableTitle>
        ) : (
          <StaticTitle onClick={handleEditTitle}>{swimlane.name}</StaticTitle>
        )}
        <Button style={{ width: '30px', height: '30px', padding: '0px' }} onClick={() => onDeleteList(swimlane.id || '')}>✕</Button>
      </Header>
      <CardContainer>
        {tasks.map((task) => (
          <Card key={task.id} ref={task.ref} $isDragging={Boolean(taskToDrag)} onMouseDown={() => onMouseDownTask(task)} onMouseUp={cleanupDrag}>
            {task.text}
          </Card>
        ))}
        {isAddingTask && (
          <EditableCard ref={textAreaRef} placeholder="Insira um título ou cole um link">
          </EditableCard>
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