import { JSX } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { BoardsPage } from './pages/BoardsPage';
import { SingleBoardPage } from './pages/SingleBoardPage';
import { LoginPage } from './pages/LoginPage';

function App(): JSX.Element {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<BoardsPage />} />
          <Route path="/board/:id" element={<SingleBoardPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
