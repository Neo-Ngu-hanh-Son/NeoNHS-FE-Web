import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockOutlined, EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthLocale } from "../i18n/AuthLocaleContext";

interface SetPasswordFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
    onSubmit: (password: string) => void;
    loading?: boolean;
    error?: string | null;
    token?: string;
}

export function SetPasswordForm({
    className,
    onSubmit,
    loading = false,
    error = null,
    token,
    ...props
}: SetPasswordFormProps) {
    const { t } = useAuthLocale();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState("");

    const validatePassword = (pass: string) => {
        if (pass.length < 8) return t('setPwd.errMin');
        if (!/[A-Za-z]/.test(pass)) return t('setPwd.errLetter');
        if (!/\d/.test(pass)) return t('setPwd.errNumber');
        return null;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidationError("");

        // Basic Validations
        const passError = validatePassword(password);
        if (passError) {
            setValidationError(passError);
            return;
        }

        if (password !== confirmPassword) {
            setValidationError(t('setPwd.errMismatch'));
            return;
        }

        onSubmit(password);
    };

    return (
        <div className={cn("w-full max-w-md mx-auto", className)}>
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg">
                    <LockOutlined className="text-2xl text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('setPwd.title')}</h1>
                <p className="text-gray-500">
                    {t('setPwd.subtitle')}{' '}
                    <span className="text-indigo-600 font-semibold">{t('common.vendorAccount')}</span>
                </p>
            </div>

            {/* Global Error Alert */}
            {(error || validationError) && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-red-600 text-xs font-bold">!</span>
                    </div>
                    <p className="text-sm text-red-700">{error || validationError}</p>
                </div>
            )}

            {!token && !error && (
                <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-yellow-600 text-xs font-bold">!</span>
                    </div>
                    <p className="text-sm text-yellow-700">{t('setPwd.invalidLink')}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} {...props}>
                <div className="space-y-5">
                    {/* New Password Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <LockOutlined className="text-gray-400" />
                            New Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder={t('setPwd.newPasswordPh')}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setValidationError("");
                                }}
                                disabled={loading || !token}
                                className="h-12 px-4 pr-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                disabled={loading || !token}
                            >
                                {showPassword ? <EyeOutlined className="text-lg" /> : <EyeInvisibleOutlined className="text-lg" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 pl-1">
                            {t('setPwd.hint')}
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <LockOutlined className="text-gray-400" />
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder={t('setPwd.confirmPasswordPh')}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setValidationError("");
                                }}
                                disabled={loading || !token}
                                className="h-12 px-4 pr-12 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                disabled={loading || !token}
                            >
                                {showConfirmPassword ? <EyeOutlined className="text-lg" /> : <EyeInvisibleOutlined className="text-lg" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-2">
                        <Button
                            type="submit"
                            disabled={loading || !token}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-300 text-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <LoadingOutlined className="animate-spin" />
                                    {t('setPwd.saving')}
                                </span>
                            ) : (
                                t('setPwd.save')
                            )}
                        </Button>
                    </div>
                </div>

                {/* Back to Login Link */}
                <p className="mt-8 text-center text-gray-600">
                    {t('setPwd.remembered')}{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                        {t('setPwd.signIn')}
                    </Link>
                </p>
            </form>
        </div>
    );
}
