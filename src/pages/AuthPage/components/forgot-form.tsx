import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import { useState } from "react"
import { authService } from "@/services/api/authService"
import { Link } from "react-router-dom"

import { NewPasswordForm } from "./new-password-form"

export function ForgotForm({ className, ...props }: React.ComponentProps<"div">) {
  const [step, setStep] = useState<"email" | "otp" | "new-password">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (email) {
      setLoading(true)
      try {
        await authService.forgotPassword(email)
        setStep("otp")
      } catch (err: any) {
        setError(err?.message || "Failed to send OTP")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await authService.verifyOTP(email, otp)
      setStep("new-password")
    } catch (err: any) {
      setError(err?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError("")
    setLoading(true)
    try {
      await authService.forgotPassword(email)
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleSetNewPassword = async (password: string, confirmPassword?: string) => {
    setError("")
    setLoading(true)
    try {
      await authService.resetPassword(email, password, confirmPassword || password)
      // Optionally, redirect to login or show success message
      setStep("email")
    } catch (err: any) {
      setError(err?.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {step === "email" && (
        <form onSubmit={handleSendOTP}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
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
                  className="pl-10"
                />
              </div>
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
            {error && <FieldDescription className="text-red-500 text-center">{error}</FieldDescription>}
            <FieldDescription className="text-center">
              Remember your password?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Back to Login
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      )}
      {step === "otp" && (
        <form onSubmit={handleVerifyOTP}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold">Enter verification code</h1>
              <p className="text-muted-foreground text-sm text-balance">
                We sent a 6-digit code to <span className="font-medium">{email}</span>
              </p>
            </div>
            <Field className="flex flex-col items-center">
              <FieldLabel htmlFor="otp" className="sr-only">
                Verification code
              </FieldLabel>
              <InputOTP
                maxLength={6}
                id="otp"
                required
                inputMode="numeric"
                pattern="[0-9]*"
                containerClassName="justify-center"
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription className="text-center mt-3">
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </Button>
            {error && <FieldDescription className="text-red-500 text-center">{error}</FieldDescription>}
            <FieldDescription className="text-center">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                className="underline underline-offset-4 hover:text-foreground"
                disabled={loading}
              >
                Resend
              </button>
            </FieldDescription>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              <ArrowLeftOutlined />
              Change email
            </button>
          </FieldGroup>
        </form>
      )}
      {step === "new-password" && (
        <NewPasswordForm onSubmit={handleSetNewPassword} loading={loading} error={error} />
      )}
    </div>
  )
}
