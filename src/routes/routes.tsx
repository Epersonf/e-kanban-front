import { JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import { BoardsPage } from "../pages/BoardsPage";
import { SingleBoardPage } from "../pages/SingleBoardPage";

function MainRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      //TODO fazer rotas protegidas abaixo
      <Route path="/boards" element={<BoardsPage />} />
      <Route path="/boards/:boardId" element={<SingleBoardPage />} />


    </Routes>
  )
}

export default MainRoutes;
