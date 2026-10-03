/**
 * @file Login.tsx
 * @description Login page component for the Dojo Management Suite (DMS) frontend.
 * Handles user authentication, credential validation, multi-tenant headers, and session redirection.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

/**
 * Login component renders the authentication form, manages state for credentials,
 * toggles password visibility, and interacts with the authentication backend.
 * 
 * @component
 * @returns {JSX.Element} The rendered login page layout.
 */
export function Login(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  /**
   * Handles form submission, authenticates credentials via the API client,
   * saves session data in the global auth store, and redirects to the dashboard.
   * 
   * @async
   * @function handleLogin
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>}
   */
  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setError("");
      const response = await apiClient.post("/auth/login", { email, password });
      const { accessToken, user } = response.data;
      
      setAuth(accessToken, user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión. Comprueba tus credenciales.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Dojo Management Suite</CardTitle>
          <CardDescription className="text-center">
            Introduce tus credenciales para acceder a la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="superadmin@fox-jiujitsu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;