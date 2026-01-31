import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleFilled,
  CloseCircleFilled
} from "@ant-design/icons"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [countDown, setCountDown] = useState(0)
  const [isCounting, setIsCounting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    if (!isCounting || countDown <= 0) {
      setIsCounting(false)
      return
    }

    const timer = setInterval(() => {
      setCountDown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isCounting, countDown])

  const handleSendCode = () => {
    setCountDown(30)
    setIsCounting(true)
  }

  // Password validation
  const passwordChecks = {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
  }

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg">
          <UserOutlined className="text-2xl text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-500">
          Join us to explore <span className="text-emerald-600 font-semibold">Ngu Hanh Son</span>
        </p>
      </div>

      {/* Form */}
      <form {...props}>
        <div className="space-y-4">
          {/* Row 1: Full Name & Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <UserOutlined className="text-gray-400" />
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                required
                className="h-12 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <PhoneOutlined className="text-gray-400" />
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                required
                className="h-12 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Email & Verification Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
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
                className="h-12 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            {/* Validation Code */}
            <div className="space-y-2">
              <label htmlFor="validation-code" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <SafetyCertificateOutlined className="text-gray-400" />
                Verification Code
              </label>
              <div className="flex gap-2">
                <Input
                  id="validation-code"
                  type="text"
                  placeholder="6-digit code"
                  required
                  className="flex-1 h-12 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                />
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-12 px-4 rounded-xl font-medium transition-all min-w-[100px]",
                    isCounting
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                  )}
                  onClick={handleSendCode}
                  disabled={isCounting}
                >
                  {isCounting ? (
                    <span className="flex items-center gap-1">
                      <span className="text-lg font-semibold">{countDown}</span>
                      <span className="text-xs">s</span>
                    </span>
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Row 3: Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <LockOutlined className="text-gray-400" />
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 px-4 pr-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOutlined className="text-lg" /> : <EyeInvisibleOutlined className="text-lg" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <LockOutlined className="text-gray-400" />
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    "h-12 px-4 pr-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all",
                    confirmPassword.length > 0 && !passwordsMatch && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showConfirmPassword ? <EyeOutlined className="text-lg" /> : <EyeInvisibleOutlined className="text-lg" />}
                </button>
              </div>
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <CloseCircleFilled className="text-xs" />
                  Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="text-sm text-emerald-600 flex items-center gap-1.5">
                  <CheckCircleFilled className="text-xs" />
                  Passwords match
                </p>
              )}
            </div>
          </div>

          {/* Password Requirements - Full Width */}
          {password.length > 0 && (
            <div className="p-3 rounded-lg bg-gray-50 flex flex-wrap gap-x-6 gap-y-1.5">
              <PasswordCheck passed={passwordChecks.length} text="At least 8 characters" />
              <PasswordCheck passed={passwordChecks.hasLetter} text="Contains a letter" />
              <PasswordCheck passed={passwordChecks.hasNumber} text="Contains a number" />
            </div>
          )}

          {/* Submit Button */}
            <div className="flex justify-center">
            <Button
              type="submit"
              className="h-10 px-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 text-lg"
            >
              Create Account
            </Button>
            </div>
        </div>

        {/* Login Link */}
        <p className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}

// Helper component for password requirements
function PasswordCheck({ passed, text }: { passed: boolean; text: string }) {
  return (
    <div className={cn(
      "flex items-center gap-2 text-xs transition-colors",
      passed ? "text-emerald-600" : "text-gray-400"
    )}>
      {passed ? (
        <CheckCircleFilled className="text-emerald-500" />
      ) : (
        <div className="w-3 h-3 rounded-full border border-gray-300" />
      )}
      {text}
    </div>
  )
}
