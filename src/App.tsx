import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoute from "./app/app.route";

function App() {
  return (
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  );
}

export default App;
