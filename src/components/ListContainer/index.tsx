import { ChangeEvent, useEffect, useState } from "react";
import { Container } from "./styles";
import { observer } from "mobx-react";
import { Board } from "../../models/general/board.model";
import { SwimlanesApi } from "../../infra/api/swimlanes.api";
import { List } from "../List";
import * as ListStyles from "../List/styles";
import { observable, runInAction } from "mobx";
import { Swimlane } from "../../models/general/swimlane.model";

interface SwimlaneData {
  id: string;
  name: string;
  swimlane: Swimlane;
}

interface ListContainerProps {
  board: Board;
  onOpenTaskModal?: (swimlaneId: string, task?: any) => void;
}

export const ListContainer: React.FC<ListContainerProps> = observer(({
board,
  onOpenTaskModal
}) => {
  const [isAddingList, setIsAddingList] = useState(false);
  const [addingListTitle, setAddingListTitle] = useState('');

  const [swimlanes] = useState<SwimlaneData[]>(() => observable([]));

  const addList = () => {
    runInAction(async () => {
      const res = await SwimlanesApi.createSwimlane({
        swimlanes: [
          {
            boardId: board.id || '',
            name: addingListTitle,
            order: 0
          }
        ]
      });

      if (res.getError()) return;

      const values = res.getValue();
      if (!values) return;

      setIsAddingList(false);

      console.log(values[0]);

      const newSwimlane: SwimlaneData = {
        id: values[0].id!,
        name: values[0].name,
        swimlane: values[0]
      };

      setAddingListTitle('');
      swimlanes.push(newSwimlane);
    });
  }

  const onDeleteList = (swimlaneId: string) => {
    runInAction(() => {
      swimlanes.splice(swimlanes.findIndex(swimlane => swimlane.id === swimlaneId), 1);
    });
  }

  const startAddingList = () => {
    setIsAddingList(true);
  }

  const cancelAddingList = () => {
    setIsAddingList(false);
  }

  // TODO: Fix this bug
  useEffect(() => {
    const newSwimlanes = board.getSwimlanes().map(swimlane => {
      return {
        id: swimlane.id,
        name: swimlane.name,
        swimlane
      } as SwimlaneData;
    });

    swimlanes.push(...newSwimlanes);

    return () => {
      swimlanes.length = 0;
    }
  }, [board, swimlanes]);

  return (
    <Container>
      {swimlanes.map(data => (
        <List 
          onDelete={onDeleteList} 
          key={data.id} 
          swimlane={data.swimlane}
          onOpenTaskModal={onOpenTaskModal} 
        />
      ))}
      {isAddingList ? (
        <ListStyles.Container>
          <ListStyles.Header>
            <ListStyles.EditableTitle value={addingListTitle} onChange={(e: ChangeEvent<HTMLInputElement>) => { setAddingListTitle(e.target.value) }} placeholder="Digite o nome da lista..."></ListStyles.EditableTitle>
          </ListStyles.Header>
          <div style={{ display: "flex", gap: "4px" }}>
            <ListStyles.Button style={{ backgroundColor: "#579DFF", color: "#222", fontWeight: "bold", borderRadius: "3px" }} onClick={addList}>Adicionar Lista</ListStyles.Button>
            <ListStyles.Button style={{ width: '31px', height: '31px', padding: '0px', borderRadius: "3px" }} onClick={cancelAddingList}>✕</ListStyles.Button>
          </div>
        </ListStyles.Container>
      ) : (
        <ListStyles.Button style={{ width: "268px", textAlign: "start", backgroundColor: "#ABAAAC", color: "#222", fontWeight: "bold", borderRadius: "10px", padding: "15px", height: "fit-content" }} onClick={startAddingList}>+ Adicionar outra lista</ListStyles.Button>
      )}
      {/* <List>
        <Header>
          {isEditingTitle ? (
            <EditableTitle>{title}</EditableTitle>
          ) : (
            <StaticTitle onClick={handleEditTitle}>{title}</StaticTitle>
          )}
          <Button style={{ width: '30px', height: '30px', padding: '0px' }}>✕</Button>
        </Header>
        <CardContainer>
          {cards.map((card) => (
            <Card ref={card.ref} $isDragging={Boolean(cardToDrag)} onMouseDown={() => onMouseDownCard(card)} onMouseUp={cleanupDrag} key={card.id}>
              {card.text}
            </Card>
          ))}
          {isAddingCard && (
            <EditableCard ref={textAreaRef} placeholder="Insira um título ou cole um link">
            </EditableCard>
          )}
        </CardContainer>
        {isAddingCard ? (
          <div style={{ display: "flex", gap: "4px" }}>
            <Button style={{ backgroundColor: "#579DFF", color: "#222", fontWeight: "bold", borderRadius: "3px" }} onClick={handleAddCard}>Adicionar Cartão</Button>
            <Button style={{ width: '31px', height: '31px', padding: '0px' }} onClick={cancelAddingCard}>✕</Button>
          </div>
        ) : (
          <Button onClick={startAddingCard}>+ Adicionar Cartão</Button>
        )}
      </List> */}
    </Container>
  );
});