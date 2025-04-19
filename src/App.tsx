import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import { BoardsPage } from './pages/BoardsPage';
import { SingleBoardPage } from './pages/SingleBoardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/board/:id" element={<SingleBoardPage />} />
        <Route path="/" element={<BoardsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
