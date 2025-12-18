import { Route, Routes } from "react-router";
import SigninForm from "./auth/components/SigninForm";
import AuthRoute from "./auth/auth.route";
import KeyForm from "./key/components/KeyForm";
import InactiveKeyList from "./key/components/InactiveKeyList";
import DashboardLayout from "./layout/DashboardLayout";
import ClientForm from "./client/components/ClientForm";
import ClientKeysView from "./client/components/ClientKeysView";
import KeyReports from "./reports/components/KeyReports";

export default function AppRoute() {
  return (
    <div className="h-screen">
      <Routes>
        <Route index element={<SigninForm />} />
        <Route path="/signin" element={<AuthRoute />} />
        <Route element={<DashboardLayout />}>
          <Route path="/client/dashboard" element={<ClientForm />} />
          <Route path="/client/:clientId/keys" element={<ClientKeysView />} />
          <Route path="/key/dashboard" element={<KeyForm />} />
          <Route path="/key/inactive" element={<InactiveKeyList />} />
          <Route path="/reports" element={<KeyReports />} />
        </Route>
      </Routes>
    </div>
  );
}
