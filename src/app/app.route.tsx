import { Route, Routes } from "react-router-dom";
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
        <Route
          path="/client/dashboard"
          element={
            <DashboardLayout>
              <ClientForm />
            </DashboardLayout>
          }
        />
        <Route
          path="/client/:clientId/keys"
          element={
            <DashboardLayout>
              <ClientKeysView />
            </DashboardLayout>
          }
        />
        <Route
          path="/key/dashboard"
          element={
            <DashboardLayout>
              <KeyForm />
            </DashboardLayout>
          }
        />
        <Route
          path="/key/inactive"
          element={
            <DashboardLayout>
              <InactiveKeyList />
            </DashboardLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <DashboardLayout>
              <KeyReports />
            </DashboardLayout>
          }
        />
      </Routes>
    </div>
  );
}
