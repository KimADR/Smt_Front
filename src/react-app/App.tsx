import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import Dashboard from "@/react-app/pages/Dashboard";
import Entreprises from "@/react-app/pages/Entreprises";
import NotificationContainer from "@/react-app/components/NotificationContainer";
import { useNotifications } from "@/react-app/hooks/useNotifications";
import { createContext, useContext } from "react";

const NotificationContext = createContext<ReturnType<typeof useNotifications> | null>(null);

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
}

export default function App() {
  const notificationSystem = useNotifications();

  return (
    <NotificationContext.Provider value={notificationSystem}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/entreprises" element={<Entreprises />} />
          </Routes>
          <NotificationContainer 
            notifications={notificationSystem.notifications}
            onRemove={notificationSystem.removeNotification}
          />
        </div>
      </Router>
    </NotificationContext.Provider>
  );
}
