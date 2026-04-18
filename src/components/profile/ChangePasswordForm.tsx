import { useState } from 'react';
import { Form, Input, message } from 'antd';
import { userService } from '@/services/api/userService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Save,
  RotateCcw,
} from 'lucide-react';

export function ChangePasswordForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const requirements = [
    { label: 'Tối thiểu 8 ký tự', met: passwordValue.length >= 8 },
    { label: 'Ít nhất một chữ in hoa', met: /[A-Z]/.test(passwordValue) },
    { label: 'Ít nhất một chữ số', met: /[0-9]/.test(passwordValue) },
    { label: 'Ít nhất một ký tự đặc biệt', met: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await userService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });
      message.success('Đổi mật khẩu thành công!');
      form.resetFields();
      setPasswordValue('');
    } catch (error: any) {
      message.error(error?.response?.data?.message || error?.message || 'Không thể đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Bảo mật & Cài đặt tài khoản</CardTitle>
            <CardDescription>Thay đổi mật khẩu để bảo vệ tài khoản</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          onValuesChange={(changed) => {
            if (changed.newPassword !== undefined) {
              setPasswordValue(changed.newPassword || '');
            }
          }}
        >
          {/* Left: Form Fields */}
          <div className="lg:col-span-7 space-y-4">
            <Form.Item
              label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu hiện tại</span>}
              name="oldPassword"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
            >
              <Input.Password className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu mới</span>}
                name="newPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
              >
                <Input.Password className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors" />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Xác nhận mật khẩu</span>}
                name="confirmNewPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                    },
                  }),
                ]}
              >
                <Input.Password className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-1 focus:ring-ring focus:border-primary outline-none transition-colors" />
              </Form.Item>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  form.resetFields();
                  setPasswordValue('');
                }}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Huỷ bỏ
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Cập nhật mật khẩu
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Right: Requirements Checklist */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Yêu cầu mật khẩu
            </h3>
            <ul className="space-y-3">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm">
                  {req.met ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                  <span className={req.met ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}>
                    {req.label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                <strong>Lưu ý:</strong> Chúng tôi khuyến khích sử dụng mật khẩu riêng biệt mà bạn không dùng trên các trang web khác.
              </p>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
