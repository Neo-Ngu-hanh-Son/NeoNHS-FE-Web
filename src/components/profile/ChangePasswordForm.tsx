import { useState } from 'react';
import { Form, Input, message } from 'antd';
import { userService } from '@/services/api/userService';

export function ChangePasswordForm() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');

    const requirements = [
        { label: 'Minimum 8 characters', met: passwordValue.length >= 8 },
        { label: 'At least one uppercase letter', met: /[A-Z]/.test(passwordValue) },
        { label: 'At least one number', met: /[0-9]/.test(passwordValue) },
        { label: 'At least one special character', met: /[^A-Za-z0-9]/.test(passwordValue) },
    ];

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await userService.changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
                confirmNewPassword: values.confirmNewPassword,
            });
            message.success('Password changed successfully!');
            form.resetFields();
            setPasswordValue('');
        } catch (error: any) {
            message.error(error?.response?.data?.message || error?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Security & Account Settings</h2>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                onValuesChange={(changed) => {
                    if (changed.newPassword !== undefined) {
                        setPasswordValue(changed.newPassword || '');
                    }
                }}
            >
                {/* Left: Form Fields */}
                <div className="lg:col-span-7 space-y-6">
                    <Form.Item
                        label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</span>}
                        name="oldPassword"
                        rules={[{ required: true, message: 'Current password is required' }]}
                    >
                        <Input.Password className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</span>}
                            name="newPassword"
                            rules={[{ required: true, message: 'New password is required' }]}
                        >
                            <Input.Password className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</span>}
                            name="confirmNewPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Confirmation is required' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </Form.Item>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => {
                                form.resetFields();
                                setPasswordValue('');
                            }}
                            className="px-6 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 transition-all active:scale-95"
                        >
                            {loading ? 'Processing...' : 'Update Password'}
                        </button>
                    </div>
                </div>

                {/* Right: Requirements Checklist */}
                <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                        Password Requirements
                    </h3>
                    <ul className="space-y-3">
                        {requirements.map((req, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm">
                                <span className={`material-symbols-outlined text-base ${req.met ? 'text-green-500' : 'text-slate-300'}`}>
                                    {req.met ? 'check_circle' : 'circle'}
                                </span>
                                <span className={req.met ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500'}>
                                    {req.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/20">
                        <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed">
                            <strong>Note:</strong> We recommend using a unique password that you don't use on other websites.
                        </p>
                    </div>
                </div>
            </Form>
        </div>
    );
}
