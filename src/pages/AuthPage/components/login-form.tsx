import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { EyeOutlined, EyeInvisibleOutlined, LoadingOutlined } from "@ant-design/icons"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authService, LoginCredentials } from "@/services/api/authService"
// Thay đổi import: Dùng GoogleLogin component thay vì useGoogleLogin hook
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Không cần state isGoogleLoading thủ công nữa vì Google Button tự handle UI
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

  // --- XỬ LÝ LOGIN THƯỜNG ---
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
  
  // --- XỬ LÝ LOGIN GOOGLE ---
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError(null);
    
    // credentialResponse.credential CHÍNH LÀ ID TOKEN
    const idToken = credentialResponse.credential;

    if (!idToken) {
        setError("Cannot retrieve Google ID Token.");
        return;
    }

    // (Optional) Log thử xem token có gì bên trong
    // const decoded = jwtDecode(idToken);
    // console.log("User Google Info:", decoded);

    setIsLoading(true); // Tận dụng state loading chung để chặn user thao tác

    try {
      // Gửi idToken xuống backend Spring Boot
      const response = await authService.loginGoogle({ 
        idToken: idToken 
      });
      // console.log("idToken from login-form", idToken);
      // console.log("response from login-form", response);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
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
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <h1 className="text-2xl font-bold text-primary">Ngu Hanh Son Tourism</h1>
          <p className="text-muted-foreground text-balance">
            Start your journey now
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center font-medium border border-destructive/20">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              className="pr-10"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              disabled={isLoading}
            >
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </button>
          </div>
          <div className="flex items-end">
            <Link
              to="/forgot-password"
              className="ml-auto text-sm text-primary underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <LoadingOutlined className="mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          {/* Thay thế nút tự chế bằng GoogleLogin Component chuẩn */}
          <div className="flex justify-center w-full">
             <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"     // Giao diện viền giống nút cũ của bạn
                size="large"        // Kích thước lớn
                shape="rectangular" // Hình chữ nhật
                width="100%"        // Cố gắng full width (tùy parent container)
                text="signin_with"  // Text hiển thị
                useOneTap           // Hiển thị popup góc phải nếu đã login
             />
          </div>
          
          <FieldDescription className="text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}