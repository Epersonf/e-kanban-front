import { JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import { BoardsPage } from "../pages/BoardsPage";
import { SingleBoardPage } from "../pages/SingleBoardPage";

function MainRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />}/>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/boards" element={<BoardsPage />} />
      <Route path="/board/:id" element={<SingleBoardPage />} />

      //TODO fazer rotas protegidas abaixo

    </Routes>
  )
}

export default MainRoutes;