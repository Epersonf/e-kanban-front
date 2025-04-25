import { BrowserRouter } from "react-router-dom";
import MainRoutes from "./routes/routes";
import { ThemeProvider } from "styled-components";
import theme from "./themes/themes";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
