import { Route, Routes } from "react-router";
import SigninForm from "./auth/components/SigninForm";
import AuthRoute from "./auth/auth.route";
import KeyForm from "./key/components/KeyForm";
import DashboardLayout from "./layout/DashboardLayout";
import ClientForm from "./client/components/ClientForm";

export default function AppRoute() {
  return (
    <div className="h-screen">
      <Routes>
        <Route index element={<SigninForm />} />
        <Route path="/signin" element={<AuthRoute />} />
        <Route element={<DashboardLayout />}>
          <Route path="/client/dashboard" element={<ClientForm />} />
          <Route path="/key/dashboard" element={<KeyForm />} />
        </Route>
      </Routes>
    </div>
  );
}
