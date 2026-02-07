import { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { User } from '@/types';
import { userService } from '@/services/api/userService';
import { motion } from 'framer-motion';

interface UserEditFormProps {
    user: User;
    onSaved?: (user: User) => void;
}

export function UserEditForm({ user, onSaved }: UserEditFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
    }, [user, form]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...user,
                ...values,
            };

            const updated = await userService.updateProfile(payload);
            onSaved?.(updated);
            message.success({ content: 'Profile updated successfully!', key: 'profile-update' });
        } catch (error: any) {
            message.error({ content: error?.message || 'Update failed', key: 'profile-update' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
            </div>

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    fullname: user.fullname,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    label={<span className="text-sm font-semibold text-gray-700">Full Name</span>}
                    name="fullname"
                    rules={[
                        { required: true, message: 'Please enter your full name' },
                        { min: 2, message: 'Name must be at least 2 characters' },
                    ]}
                >
                    <Input
                        placeholder="Enter your full name"
                        size="large"
                        className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-sm font-semibold text-gray-700">Email</span>}
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' },
                    ]}
                >
                    <Input
                        disabled
                        placeholder="your@email.com"
                        size="large"
                        className="rounded-xl border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed shadow-none"
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-sm font-semibold text-gray-700">Phone Number</span>}
                    name="phoneNumber"
                    rules={[
                        { pattern: /^[0-9]{10,11}$/, message: 'Please enter a valid phone number' },
                    ]}
                >
                    <Input
                        placeholder="0123456789"
                        size="large"
                        className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                    />
                </Form.Item>

                <div className="flex gap-3 mt-6">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={loading}
                        size="large"
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none shadow-lg shadow-blue-500/50 font-semibold"
                    >
                        Save Changes
                    </Button>
                    <Button
                        onClick={() => form.resetFields()}
                        size="large"
                        className="h-12 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 font-semibold"
                    >
                        Reset
                    </Button>
                </div>
            </Form>
        </motion.div>
    );
}
