import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [countDown, setCountDown] = useState(0)
  const [isCounting, setIsCounting] = useState(false)

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


  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Register the account to explore together
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input id="name" type="text" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input id="phone" type="tel" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="validation-code">Enter validation code</FieldLabel>
          <div className="flex gap-2 items-stretch">
            <Input id="validation-code" type="text" placeholder="Enter validation code" required className="flex-1" />
            <Button 
              type="button" 
              variant="outline" 
              className="h-auto min-w-[100px]" 
              onClick={handleSendCode}
              disabled={isCounting}
            >
              {isCounting ? `${countDown}s` : "Send Code"}
            </Button>
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" required />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input id="confirm-password" type="password" required />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link to="/login">Log in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
