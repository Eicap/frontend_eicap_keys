import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSignin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth.store";
import "./SigninForm.css";

function SigninForm() {
  const { form, onSubmit } = useSignin();
  const { isLoading, error: storeError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    try {
      const isValid = await form.trigger();
      if (!isValid) return;

      const data = form.getValues();
      await onSubmit(data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="signin-container">
      {/* Main centered card container */}
      <div className="login-card-wrapper">
        {/* Left side - White card with form */}
        <div className="login-card-left">
          {/* User avatar */}
          <div className="user-avatar-wrapper">
            <div className="user-avatar">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Error message */}
            {storeError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{storeError}</div>
            )}

            {/* Username field */}
            <div className="form-group">
              <div className="input-wrapper">
                <div className="input-icon">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="EMAIL"
                  {...form.register("email", {
                    setValueAs: (value: string) => value.toLowerCase(),
                  })}
                  onBlur={() => {
                    setTouched({ ...touched, email: true });
                    form.trigger("email");
                  }}
                  error={touched.email ? form.formState.errors.email?.message : undefined}
                  className="form-input"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="form-group">
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD"
                  {...form.register("password")}
                  onBlur={() => {
                    setTouched({ ...touched, password: true });
                    form.trigger("password");
                  }}
                  error={touched.password ? form.formState.errors.password?.message : undefined}
                  className="form-input"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </span>
              </div>
            </div>

            {/* Login button */}
            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>LOADING...</span>
                </div>
              ) : (
                <span>LOGIN</span>
              )}
            </button>
          </form>

          {/* Social login dots */}
          <div className="social-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Right side - Gradient welcome section */}
        <div className="login-card-right">
          <div className="welcome-content">
            {/* Logo and company name */}
            <div className="logo-branding-section">
              <div className="logo-container">
                <img src="/src/assets/icon.ico" alt="EICAP Logo" className="welcome-logo" />
              </div>
            </div>

            <h1 className="welcome-title">
              {" "}
              Escuela de Innovación, Capacitación y<br />
              Asesoramiento Profesional
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SigninForm;
