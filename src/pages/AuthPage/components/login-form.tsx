import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  EyeOutlined, 
  EyeInvisibleOutlined, 
  LoadingOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined
} from "@ant-design/icons"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authService, LoginCredentials } from "@/services/api/authService"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login(formData)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      navigate("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError(null);
    
    const idToken = credentialResponse.credential;

    if (!idToken) {
        setError("Cannot retrieve Google ID Token.");
        return;
    }

    setIsLoading(true); 

    try {
      const response = await authService.loginGoogle({ 
        idToken: idToken 
      });
      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("user", JSON.stringify(response.user));
      navigate("/");
    } catch (err: any) {
      console.error("Backend Google Login Error:", err);
      setError(err.response?.data?.message || "Google login failed on server.");
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleGoogleError = () => {
      setError("Google Login failed connection.");
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg">
          <UserOutlined className="text-2xl text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500">
          Sign in to explore <span className="text-emerald-600 font-semibold">Ngu Hanh Son</span>
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-red-600 text-xs font-bold">!</span>
          </div>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} {...props}>
        <div className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MailOutlined className="text-gray-400" />
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className="h-12 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <LockOutlined className="text-gray-400" />
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className="h-12 px-4 pr-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOutlined className="text-lg" /> : <EyeInvisibleOutlined className="text-lg" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingOutlined className="animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"     
            size="large"        
            shape="pill" 
            width="100%"        
            text="signin_with"  
            useOneTap           
          />
        </div>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link 
            to="/register" 
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  )
}
