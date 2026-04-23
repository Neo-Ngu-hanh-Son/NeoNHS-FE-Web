import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { authService } from '@/services/api/authService';
import loginImage from '@/assets/images/login-img.jpg';
import { SetPasswordForm } from './components/set-password-form';
import { AuthBrandingBar } from './components/AuthBrandingBar';
import { useAuthLocale } from './i18n/AuthLocaleContext';
import { authErrorDesc } from './i18n/authApiErrorDescription';

export default function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();
  const { t } = useAuthLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [api, contextHolder] = notification.useNotification();

  const handleSetPassword = async (password: string) => {
    setError('');
    setLoading(true);

    if (!token && !email) {
      setError(t('setPwdPage.invalidLink'));
      setLoading(false);
      return;
    }

    try {
      // Send token and password to backend (or email, if backend expects it differently)
      const response: any = await authService.setPassword(email, token, password);

      if (response && response.success === false) {
        throw { response: { data: { message: response.message } } };
      }

      api.success({
        message: t('setPwdPage.okTitle'),
        description: t('setPwdPage.okDesc'),
        icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
        placement: 'topRight',
        duration: 3,
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = authErrorDesc(err, t, 'setPwdPage.failDefault');
      setError(errorMessage);
      api.error({
        message: t('setPwdPage.failTitle'),
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
              <SetPasswordForm onSubmit={handleSetPassword} loading={loading} error={error} token={token || email} />
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
