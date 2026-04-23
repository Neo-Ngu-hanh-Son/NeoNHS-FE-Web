import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { notification } from "antd"
import { authService } from "@/services/api/authService"
import { useAuthLocale } from "../i18n/AuthLocaleContext"
import { authErrorDesc } from "../i18n/authApiErrorDescription"

type OTPFlow = "register" | "forgot-password"

interface LocationState {
  email: string
  flow: OTPFlow
  // For register flow, we need to pass the registration data
  registerData?: {
    name: string
    phone: string
    password: string
  }
}

export function CheckOTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useAuthLocale()
  const state = location.state as LocationState | null

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [countDown, setCountDown] = useState(60)
  const [isCounting, setIsCounting] = useState(true)
  const [api, contextHolder] = notification.useNotification()

  const email = state?.email || ""
  const flow = state?.flow || "forgot-password"

  // Redirect if no email in state
  useEffect(() => {
    if (!state?.email) {
      navigate(flow === "register" ? "/register" : "/forgot-password")
    }
  }, [state, navigate, flow])

  // Countdown timer for resend
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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      api.error({
        title: t('otp.invalidTitle'),
        description: t('otp.invalidDesc'),
        icon: <CloseCircleOutlined style={{ color: '#ef4444' }} />,
        placement: 'topRight',
        duration: 3,
      })
      return
    }

    setLoading(true)
    try {
      if (flow === "forgot-password") {
        // Verify OTP for forgot password flow
        await authService.verifyOTP(email, otp)
        api.success({
          title: t('otp.verifiedTitle'),
          description: t('otp.verifiedDesc'),
          icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
          placement: 'topRight',
          duration: 3,
        })
        // Navigate to new password form
        navigate('/new-password', { state: { email, otp } })
      } else {
        // For register flow - verify and complete registration
        await authService.verifyRegistrationOTP(email, otp)
        api.success({
          title: t('otp.registerOkTitle'),
          description: t('otp.registerOkDesc'),
          icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
          placement: 'topRight',
          duration: 3,
        })
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (err: any) {
      api.error({
        title: t('otp.verifyFailTitle'),
        description: err.response?.data?.message || t('otp.verifyFailDefault'),
        icon: <CloseCircleOutlined style={{ color: '#ef4444' }} />,
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    try {
      if (flow === "forgot-password") {
        await authService.forgotPassword(email)
      } else {
        await authService.resendRegistrationOTP(email)
      }
      setCountDown(60)
      setIsCounting(true)
      api.success({
        title: t('otp.resentTitle'),
        description: t('otp.resentDesc'),
        icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
        placement: 'topRight',
        duration: 3,
      })
    } catch (err: unknown) {
      api.error({
        title: t('otp.resendFailTitle'),
        description: authErrorDesc(err, t, 'otp.resendFailDefault'),
        icon: <CloseCircleOutlined style={{ color: '#ef4444' }} />,
        placement: 'topRight',
        duration: 3,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    if (flow === "register") {
      navigate('/register')
    } else {
      navigate('/forgot-password')
    }
  }

  const getTitle = () => {
    return flow === "register" ? t('otp.titleRegister') : t('otp.titleForgot')
  }

  const getDescription = () => {
    return flow === "register" ? t('otp.descRegister') : t('otp.descForgot')
  }

  return (
    <>
      {contextHolder}
      <div className={cn("flex flex-col gap-6 w-full max-w-md mx-auto", className)} {...props}>
        <form onSubmit={handleVerifyOTP}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg">
                <SafetyCertificateOutlined className="text-2xl text-white" />
              </div>
              <h1 className="text-2xl font-bold">{getTitle()}</h1>
              <p className="text-muted-foreground text-sm text-balance">
                {getDescription()}
              </p>
              <p className="text-sm mt-2">
                {t('otp.codeSentTo')}{' '}
                <span className="font-medium text-emerald-600">{email}</span>
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
                {t('otp.hint')}
              </FieldDescription>
            </Field>

            <Button
              type="submit"
              className="h-10 px-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 text-lg"
              disabled={loading}
            >
              {loading ? t('otp.verifying') : t('otp.verify')}
            </Button>

            <FieldDescription className="text-center">
              {t('otp.didntReceive')}{' '}
              {isCounting ? (
                <span className="text-gray-400">
                  {t('otp.resendIn')}{' '}
                  <span className="font-semibold">
                    {countDown}
                    {t('otp.secondsShort')}
                  </span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="underline underline-offset-4 hover:text-foreground text-emerald-600"
                  disabled={loading}
                >
                  {t('otp.resend')}
                </button>
              )}
            </FieldDescription>

            <button
              type="button"
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              <ArrowLeftOutlined />
              {flow === "register" ? t('otp.backRegister') : t('otp.changeEmail')}
            </button>
          </FieldGroup>
        </form>
      </div>
    </>
  )
}
