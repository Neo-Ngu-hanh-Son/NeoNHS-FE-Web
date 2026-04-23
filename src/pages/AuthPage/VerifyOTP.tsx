import { CheckOTPForm } from './components/check-otp-form';
import { AuthBrandingBar } from './components/AuthBrandingBar';
import loginImage from '@/assets/images/login-img.jpg';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { useAuthLocale } from './i18n/AuthLocaleContext';

export default function VerifyOTP() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useAuthLocale();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <AuthBrandingBar />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <CheckOTPForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={loginImage}
          alt={t('branding.altHero')}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
