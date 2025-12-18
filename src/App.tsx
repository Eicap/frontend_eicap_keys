import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoute from "./app/app.route";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoute />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
