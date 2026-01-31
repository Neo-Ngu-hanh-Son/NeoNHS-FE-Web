import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { notification } from "antd"
import { authService } from "@/services/api/authService"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullname, setFullname] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification()

  // Password validation
  const passwordChecks = {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
  }

  const allChecksPassed = passwordChecks.length && passwordChecks.hasNumber && passwordChecks.hasLetter
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password requirements
    if (!allChecksPassed) {
      api.error({
        message: 'Invalid Password',
        description: "Password does not meet requirements.",
        icon: <CloseCircleOutlined style={{ color: '#ef4444' }} />,
        placement: 'topRight',
        duration: 3,
      })
      return
    }

    // Validate password match
    if (!passwordsMatch) {
      api.error({
        message: 'Password Mismatch',
        description: "Passwords do not match.",
        icon: <CloseCircleOutlined style={{ color: '#ef4444' }} />,
        placement: 'topRight',
        duration: 3,
      })
      return
    }

    setLoading(true)
    try {
      // Register and send OTP
      await authService.register({ fullname, phone, email, password })
      api.success({
        message: 'Registration Submitted!',
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
              flow: 'register',
              registerData: { fullname, phone, password }
            }
          })
      }, 1500)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again."
      api.error({
        message: 'Registration Failed',
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
        <form onSubmit={handleSubmit} {...props}>
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
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            {/* Email - Full Width */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
              />
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
                disabled={loading}
                className="h-10 px-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 text-lg"
              >
                {loading ? "Registering..." : "Register"}
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
    </>
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
