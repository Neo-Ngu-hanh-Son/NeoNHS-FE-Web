import { useEffect, useState } from 'react';
import { Form, Input, message } from 'antd';
import { User } from '@/types';
import { userService } from '@/services/api/userService';
import { ProfileAvatar } from './ProfileAvatar';

interface UserEditFormProps {
    user: User;
    onSaved?: (user: User) => void;
}

export function UserEditForm({ user, onSaved }: UserEditFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
    }, [user, form]);

    const handleAvatarUpload = async (file: File) => {
        setUploading(true);
        try {
            const { validateImageFile, uploadImageToCloudinary } = await import('@/utils/cloudinary');
            const validationError = validateImageFile(file);
            if (validationError) throw new Error(validationError);

            const avatarUrl = await uploadImageToCloudinary(file);
            if (!avatarUrl) throw new Error('Upload failed');

            const updated = await userService.updateProfile({ ...user, avatarUrl });
            message.success('Avatar updated successfully!');
            onSaved?.(updated);
        } catch (error: any) {
            message.error(error?.message || 'Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            // Merge current user with new values to ensure no data is lost in the payload
            const payload = {
                ...user,
                ...values,
            };

            const response = await userService.updateProfile(payload);

            // Critical: Merge current user state with response to prevent clearing fields
            // that the API might not have returned.
            const updatedUser = { ...user, ...values, ...(response?.id ? response : {}) };

            onSaved?.(updatedUser);
            message.success('Profile updated successfully!');
        } catch (error: any) {
            message.error(error?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
                <ProfileAvatar
                    src={user.avatarUrl}
                    alt={user.fullname}
                    size="lg"
                    onUpload={handleAvatarUpload}
                    loading={uploading}
                />
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Settings</h2>
                    <p className="text-sm text-slate-500">Manage your personal information and profile picture</p>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                        label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</span>}
                        name="fullname"
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                        <Input
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</span>}
                        name="phoneNumber"
                    >
                        <Input
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</span>}
                    name="email"
                >
                    <Input
                        disabled
                        prefix={<span className="material-symbols-outlined text-slate-400 text-lg mr-2">lock</span>}
                        suffix={<span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Contact support to change</span>}
                        className="w-full px-4 py-2.5 border-none bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed italic shadow-none"
                    />
                </Form.Item>

                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => form.setFieldsValue({
                            fullname: user.fullname,
                            email: user.email,
                            phoneNumber: user.phoneNumber,
                        })}
                        className="px-6 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </Form>
        </div>
    );
}
