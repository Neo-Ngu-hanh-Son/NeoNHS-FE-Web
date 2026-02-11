import { AppstoreOutlined } from "@ant-design/icons"

import { LoginForm } from "./components/login-form"
import loginImage from "@/assets/images/login-img.jpg"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user) {

      const currentPath = window.location.pathname;
      if (currentPath === '/login') {
        const timer = setTimeout(() => {
          const role = user.role?.toUpperCase();
          if (role === 'ADMIN') {
            navigate('/admin/dashboard', { replace: true });
          } else if (role === 'VENDOR') {
            navigate('/vendor/dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user, navigate]);
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <AppstoreOutlined className="text-sm" />
            </div>
            CCTE
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={loginImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
