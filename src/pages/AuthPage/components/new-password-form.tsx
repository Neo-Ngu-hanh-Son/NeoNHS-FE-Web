import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface NewPasswordFormProps {
    className?: string;
    onSubmit?: (password: string, confirmPassword: string) => void;
    loading?: boolean;
    error?: string;
}

export function NewPasswordForm({ className, onSubmit, loading, error: parentError }: NewPasswordFormProps) {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        setError("")
        onSubmit?.(password, confirmPassword)
    }

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-2xl font-bold">Set New Password</h1>
                        <p className="text-muted-foreground text-sm text-balance">
                            Enter your new password below.
                        </p>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="password">New Password</FieldLabel>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter new password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Field>
                    {(error || parentError) && <FieldDescription className="text-red-500 text-center">{error || parentError}</FieldDescription>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Setting..." : "Set Password"}
                    </Button>
                </FieldGroup>
            </form>
        </div>
    )
}
