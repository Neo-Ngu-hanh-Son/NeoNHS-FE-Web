import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
    LockOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    CheckCircleFilled,
    CloseCircleFilled
} from "@ant-design/icons"
import { notification } from "antd"


interface NewPasswordFormProps {
    className?: string;
    onSubmit?: (password: string, confirmPassword: string) => void;
    loading?: boolean;
    error?: string;
}

export function NewPasswordForm({ className, onSubmit, loading, error: parentError }: NewPasswordFormProps) {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [api, contextHolder] = notification.useNotification()

    // Password validation
    const passwordChecks = {
        length: password.length >= 8,
        hasNumber: /\d/.test(password),
        hasLetter: /[a-zA-Z]/.test(password),
    }

    const allChecksPassed = passwordChecks.length && passwordChecks.hasNumber && passwordChecks.hasLetter
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!allChecksPassed) {
            api.error({
                message: 'Invalid Password',
                description: "Password does not meet requirements.",
                icon: <CloseCircleFilled style={{ color: '#ef4444' }} />,
                placement: 'topRight',
                duration: 3,
            })
            return
        }
        if (password !== confirmPassword) {
            api.error({
                message: 'Password Mismatch',
                description: "Passwords do not match.",
                icon: <CloseCircleFilled style={{ color: '#ef4444' }} />,
                placement: 'topRight',
                duration: 3,
            })
            return
        }
        setError("")
        onSubmit?.(password, confirmPassword)
    }

    return (
        <>
        {contextHolder}
        <div className={cn("flex flex-col gap-6", className)}>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg">
                            <LockOutlined className="text-2xl text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">Set New Password</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            Enter your new password below.
                        </p>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="password">New Password</FieldLabel>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
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
                        {/* Password Requirements */}
                        {password.length > 0 && (
                            <div className="mt-2 p-3 rounded-lg bg-gray-50 space-y-1.5">
                                <PasswordCheck passed={passwordChecks.length} text="At least 8 characters" />
                                <PasswordCheck passed={passwordChecks.hasLetter} text="Contains a letter" />
                                <PasswordCheck passed={passwordChecks.hasNumber} text="Contains a number" />
                            </div>
                        )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
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
                            <p className="text-sm text-red-500 flex items-center gap-1.5 mt-1">
                                <CloseCircleFilled className="text-xs" />
                                Passwords do not match
                            </p>
                        )}
                        {passwordsMatch && (
                            <p className="text-sm text-emerald-600 flex items-center gap-1.5 mt-1">
                                <CheckCircleFilled className="text-xs" />
                                Passwords match
                            </p>
                        )}
                    </Field>
                    {(error || parentError) && <FieldDescription className="text-red-500 text-center">{error || parentError}</FieldDescription>}
                    <Button type="submit" className="h-10 px-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 text-lg"
                        disabled={loading}>
                        {loading ? "Setting..." : "Set Password"}
                    </Button>
                </FieldGroup>
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
