import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, AppstoreOutlined } from '@ant-design/icons';
import { authService } from '@/services/api/authService';
import loginImage from '@/assets/images/login-img.jpg';
import { SetPasswordForm } from './components/set-password-form';

export default function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [api, contextHolder] = notification.useNotification();

  const handleSetPassword = async (password: string) => {
    setError('');
    setLoading(true);

    if (!token && !email) {
      setError('Invalid setup link. Token or email is missing.');
      setLoading(false);
      return;
    }

    try {
      // Send token and password to backend (or email, if backend expects it differently)
      const response: any = await authService.setPassword(email, token, password);

      if (response && response.success === false) {
        throw new Error(response.message || 'Failed to set password');
      }

      api.success({
        message: 'Password Set Successfully!',
        description: 'Your account is ready. Redirecting to login...',
        icon: <CheckCircleOutlined style={{ color: '#10b981' }} />,
        placement: 'topRight',
        duration: 3,
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err?.message || 'Failed to set password';
      setError(errorMessage);
      api.error({
        message: 'Failed to set password',
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
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="/" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <AppstoreOutlined className="text-sm" />
              </div>
              NeoNHS
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <SetPasswordForm onSubmit={handleSetPassword} loading={loading} error={error} token={token || email} />
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <img
            src={loginImage}
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
}
