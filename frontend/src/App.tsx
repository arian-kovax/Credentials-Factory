import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { SignupProvider } from "./context/SignupContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SignupProvider>
          <AppRoutes />
        </SignupProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
