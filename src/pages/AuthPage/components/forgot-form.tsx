import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { MailOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"
import { useState } from "react"
import { authService } from "@/services/api/authService"
import { Link, useNavigate } from "react-router-dom"
import { notification } from "antd"

export function ForgotForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification()


  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (email) {
      setLoading(true)
      try {
        await authService.forgotPassword(email)
        api.success({
          message: 'OTP Sent!',
          description: 'A verification code has been sent to your email.',
          icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
          placement: 'topRight',
          duration: 3,
        })
        // Navigate to OTP verification page
        setTimeout(() => {
          navigate('/verify-otp',
            {
              state: {
                email,
                flow: 'forgot-password'
              }
            })
        }, 1500)
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to send OTP"
        setError(errorMessage)

        api.error({
          message: 'Failed to Send OTP',
          description: errorMessage,
          icon: <CloseCircleOutlined style={{ color: '#ef4444' }} />,
          placement: 'topRight',
          duration: 3,
        })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <>
      {contextHolder}
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <form onSubmit={handleSendOTP}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg">
                <MailOutlined className="text-2xl text-white" />
              </div>
              <h1 className="text-2xl font-bold">Forgot Password</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email address and we'll send you a verification code to reset your password.
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative">
                <MailOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </Field>
            <Button
              type="submit"
              className="h-10 px-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 text-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
            {error && <FieldDescription className="text-red-500 text-center">{error}</FieldDescription>}
            <FieldDescription className="text-center">
              Remember your password?{" "}
              <Link to="/login" className="underline underline-offset-4 text-emerald-600 hover:text-emerald-700">
                Back to Login
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </div>
    </>
  )
}
