import { Route, Routes, Navigate } from "react-router-dom";
import KeyForm from "./key/components/KeyForm";
import InactiveKeyList from "./key/components/InactiveKeyList";
import ClientForm from "./client/components/ClientForm";
import ClientKeysView from "./client/ClientKeysView";
import KeyReports from "./reports/components/KeyReports";

export default function AppRoute() {
  return (
    <div className="h-screen">
      <Routes>
        <Route
          path="/client/dashboard"
          element={
            <ClientForm />
          }
        />
        <Route
          path="/client/:clientId/keys"
          element={
            <ClientKeysView />
          }
        />
        <Route
          path="/key/dashboard"
          element={
            <KeyForm />
          }
        />
        <Route
          path="/key/inactive"
          element={
            <InactiveKeyList />
          }
        />
        <Route
          path="/reports"
          element={

            <KeyReports />
          }
        />
        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
