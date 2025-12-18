import { Route, Routes } from "react-router-dom";
import SigninForm from "./components/SigninForm";

export default function AuthRoute() {
  return (
    <Routes>
      <Route path="/" element={<SigninForm />} />
    </Routes>
  );
}
