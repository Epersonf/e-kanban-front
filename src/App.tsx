import { BrowserRouter } from "react-router-dom";
import MainRoutes from "./routes/routes";
import { ThemeProvider } from "styled-components";
import theme from "./themes/themes";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <MainRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;
