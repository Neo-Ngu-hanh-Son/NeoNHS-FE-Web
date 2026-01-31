import { NewPasswordForm } from "./components/new-password-form"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { authService } from "@/services/api/authService"
import { notification } from "antd"
import { CheckCircleOutlined, CloseCircleOutlined, AppstoreOutlined } from "@ant-design/icons"
import loginImage from "@/assets/images/login-img.jpg"

export default function NewPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { email: string; otp: string } | null

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [api, contextHolder] = notification.useNotification()

  const email = state?.email || ""

  // Redirect if no email/otp in state
  useEffect(() => {
    if (!state?.email || !state?.otp) {
      navigate('/forgot-password')
    }
  }, [state, navigate])

  const handleSetNewPassword = async (password: string, confirmPassword: string) => {
    setError("")
    setLoading(true)
    try {
      await authService.resetPassword(email, password, confirmPassword)
      api.success({
        message: 'Password Reset Successful!',
        description: 'Your password has been successfully reset. Redirecting to login...',
        icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
        placement: 'topRight',
        duration: 3,
      })
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err?.message || "Failed to reset password"
      setError(errorMessage)
      api.error({
        message: 'Failed to Reset Password',
        description: errorMessage,
        icon: <CloseCircleOutlined style={{ color: '#ef4444' }} />,
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
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
              <NewPasswordForm onSubmit={handleSetNewPassword} loading={loading} error={error} />
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
    </>
  )
}
