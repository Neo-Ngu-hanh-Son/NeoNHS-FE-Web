import { NewPasswordForm } from './components/new-password-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authService } from '@/services/api/authService';
import { useAuth } from '@/hooks/auth/useAuth';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import loginImage from '@/assets/images/login-img.jpg';
import { AuthBrandingBar } from './components/AuthBrandingBar';
import { useAuthLocale } from './i18n/AuthLocaleContext';
import { authErrorDesc } from './i18n/authApiErrorDescription';

export default function NewPassword() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useAuthLocale();
  const state = location.state as { email: string; otp: string } | null;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [api, contextHolder] = notification.useNotification();

  const email = state?.email || '';

  // Redirect if no email/otp in state
  useEffect(() => {
    if (!state?.email || !state?.otp) {
      navigate('/forgot-password');
    }
  }, [state, navigate]);

  const handleSetNewPassword = async (password: string, confirmPassword: string) => {
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(email, password, confirmPassword);
      api.success({
        message: t('newPwdPage.resetOkTitle'),
        description: t('newPwdPage.resetOkDesc'),
        icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
        placement: 'topRight',
        duration: 3,
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = authErrorDesc(err, t, 'newPwdPage.resetFailDefault');
      setError(errorMessage);
      api.error({
        message: t('newPwdPage.resetFailTitle'),
        description: errorMessage,
        icon: <CloseCircleOutlined style={{ color: '#ef4444' }} />,
        placement: 'topRight',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <AuthBrandingBar />
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <NewPasswordForm onSubmit={handleSetNewPassword} loading={loading} error={error} />
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
    </>
  );
}
