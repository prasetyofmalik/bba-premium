
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateReport from "./pages/CreateReport";
import ReportDetail from "./pages/ReportDetail";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/Admin/UserManagement";
import LocationManagement from "./pages/Admin/LocationManagement";

// Route guard for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin route guard
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'super_admin') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create-report" element={<ProtectedRoute><CreateReport /></ProtectedRoute>} />
            <Route path="/edit-report/:id" element={<ProtectedRoute><CreateReport /></ProtectedRoute>} />
            <Route path="/report/:id" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/admin/locations" element={<AdminRoute><LocationManagement /></AdminRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
