import { useEffect } from 'react';
import { Form, Input, Button, Upload, message, Row, Col, Card, Avatar, Space } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { userService } from '@/services/api/userService';
import type { User } from '@/types';

type Props = {
  initialUser?: User;
  loading?: boolean;
  onSaved?: (user: User) => void;
};

export const UserAccountForm = ({ initialUser, loading, onSaved }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialUser) {
      form.setFieldsValue({
        name: initialUser.name,
        email: initialUser.email,
        avatar: initialUser.avatar,
      });
    }
  }, [initialUser, form]);

  const onFinish = async (values: any) => {
    try {
      const payload: Partial<User> = {
        name: values.name,
        email: values.email,
        avatar: values.avatar,
      };
      const updated = await userService.updateProfile(payload);
      message.success('Profile updated successfully.');
      onSaved?.(updated);
    } catch (err: any) {
      message.error(err?.message ?? 'Failed to update profile.');
    }
  };

  const beforeUpload = async (file: RcFile) => {
    // Prevent auto upload; we'll upload manually to backend
    return false;
  };

  const onUploadChange = async (info: UploadChangeParam<UploadFile<any>>) => {
    const fileObj = info.file.originFileObj as File | undefined;
    if (!fileObj) return;

    try {
      const avatarUrl = await userService.uploadAvatar(fileObj);
      form.setFieldsValue({ avatar: avatarUrl });
      message.success('Avatar updated successfully.');
    } catch (err: any) {
      message.error(err?.message ?? 'Failed to upload avatar.');
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    accept: 'image/*',
    maxCount: 1,
    beforeUpload,
    onChange: onUploadChange,
    showUploadList: false,
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        name: initialUser?.name,
        email: initialUser?.email,
        avatar: initialUser?.avatar,
      }}
      disabled={loading}
    >
      <Card title="Avatar" style={{ marginBottom: 16 }}>
        <Space align="center" size="large">
          <Avatar
            size={64}
            icon={<UserOutlined />}
            src={form.getFieldValue('avatar') || initialUser?.avatar}
          />
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload new avatar</Button>
          </Upload>
        </Space>
        {/* Hidden field to keep avatar URL */}
        <Form.Item name="avatar" hidden>
          <Input type="hidden" />
        </Form.Item>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter your full name' },
              { min: 2, message: 'Name should be at least 2 characters' },
            ]}
          >
            <Input placeholder="Your name" allowClear />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="you@example.com" allowClear />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserAccountForm;
