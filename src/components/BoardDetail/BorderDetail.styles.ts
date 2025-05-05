import styled from 'styled-components';

export const BoardsPageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0a192f;
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #162447;
  color: #fff;
  padding: 16px 24px;
`;

export const StatusMessage = styled.div`
  color: #fff;
  padding: 48px;
  font-size: 22px;
  text-align: center;

  &.error {
    color: #d32f2f; /* Example error color */
  }
`;

export const BoardContent = styled.div`
  padding: 24px;
  overflow-y: auto;
`;

export const BoardTitleArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 24px;
`;

export const BoardTitle = styled.h2`
  color: #fff;
  margin: 0;
  font-size: 1.5em;
  font-weight: bold;
`;

export const TitleInput = styled.input`
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  background-color: #1f4068;
  border: 1px solid #5dade2;
  border-radius: 4px;
  padding: 4px 8px;
  outline: none;
`;

export const EditButton = styled.button`
  background: transparent;
  border: none;
  color: #a7c0cd;
  cursor: pointer;
  padding: 4px;
`;

export const DeleteButton = styled.button`
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 14px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 12px;
`;

export const ListsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
`;

export const ListWrapper = styled.div`
  min-width: 280px;
  background-color: #162447;
  /* padding: 16px; */
  border-radius: 8px;
  flex-shrink: 0;
`;

export const AddCardButton = styled.button`
  margin-top: 8px;
  background-color: #1f4068;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
`;
