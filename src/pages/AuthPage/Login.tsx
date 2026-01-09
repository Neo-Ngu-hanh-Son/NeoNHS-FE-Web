import { FacebookFilled, GoogleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, Space, Typography } from 'antd'

type LoginFormValues = {
    usernameOrEmail: string
    password: string
}

export default function Login() {
    const onFinish = (values: LoginFormValues) => {
        // TODO: call auth API
        console.log('login submit', values)
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-2 lg:items-center">
                {/* Left: Form */}
                <div className="mx-auto w-full max-w-md space-y-4">
                    <Typography.Title level={1} className="!mb-0 !text-[#42a7c3]">
                        NeoNHS
                    </Typography.Title>
                    <div className="space-y-1">
                        <div className="space-y-3">
                            <Typography.Title level={3} className="!mb-0 text-center">
                                Welcome to Ngu Hanh Son, Da Nang
                            </Typography.Title>
                            <Typography.Title level={3} className="!mb-0 text-center">
                                Start your journey now
                            </Typography.Title>
                        </div>
                        <Typography.Title level={2} className="!mb-0 text-center !text-[#42a7c3]">
                            Login
                        </Typography.Title>
                    </div>

                    <Card className="w-full" bodyStyle={{ padding: 24 }}>
                        <Form<LoginFormValues>
                            layout="vertical"
                            requiredMark={false}
                            onFinish={onFinish}
                            initialValues={{ usernameOrEmail: '', password: '' }}
                        >
                            <Form.Item
                                label="Username or Email"
                                name="usernameOrEmail"
                                rules={[{ required: true, message: 'Please enter your username or email' }]}
                            >
                                <Input
                                    size="large"
                                    placeholder="Username or Email"
                                    prefix={<UserOutlined className="text-slate-400" />}
                                    autoComplete="username"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please enter your password' }]}
                            >
                                <Input.Password
                                    size="large"
                                    placeholder="Password"
                                    prefix={<LockOutlined className="text-slate-400" />}
                                    autoComplete="current-password"
                                />
                            </Form.Item>

                            <Button type="primary" htmlType="submit" size="large" className="w-full">
                                Log In
                            </Button>

                            <div className="mt-4 text-center text-sm text-slate-600">
                                Don’t have account? <a className="font-semibold text-orange-500">Register</a>
                            </div>

                            <Divider className="!my-6">Or Login with</Divider>

                            <Space direction="vertical" className="w-full">
                                <Button size="large" className="w-full" icon={<GoogleOutlined />}>
                                    Google
                                </Button>
                                <Button size="large" className="w-full" icon={<FacebookFilled />}>
                                    Facebook
                                </Button>
                            </Space>
                        </Form>
                    </Card>

                    <Typography.Text className="block text-sm text-slate-400">
                        © 2026 Travling. All Rights Reserved
                    </Typography.Text>
                </div>

                {/* Right: Hero */}
                <div className="relative hidden overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-cyan-100 p-8 lg:block">
                    <div className="space-y-3">
                        <Typography.Title level={3} className="!mb-0">
                            Welcome to Ngu Hanh Son, Da Nang AAAAAAAAAAAAAAAAA
                        </Typography.Title>
                        <Typography.Text className="text-slate-600">Start your journey now</Typography.Text>
                    </div>

                    <div className="mt-10">
                        <Typography.Title level={2} className="!mb-0 !text-[#42a7c3]">
                            NeoNHS
                        </Typography.Title>
                    </div>

                    <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-200/40 blur-2xl" />
                    <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-sky-200/40 blur-2xl" />
                </div>
            </div>
        </div>
    )
}
