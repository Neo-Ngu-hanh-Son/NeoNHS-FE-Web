import { useEffect, useState } from 'react';
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
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  useEffect(() => {
    if (initialUser) {
      form.setFieldsValue({
        name: initialUser.fullname,
        email: initialUser.email,
        avatar: initialUser.avatarUrl,
      });
      setPreviewUrl(initialUser.avatarUrl);
    }
  }, [initialUser, form]);

  const onFinish = async (values: any) => {
    try {
      //console.log('=== FORM SUBMIT ===');
      //console.log('Form values:', values);
      //console.log('Initial user:', initialUser);

      // Merge form values with initial user data to ensure all fields are sent
      const payload: Partial<User> = {
        ...initialUser, // Include all original user data
        fullname: values.name,
        email: values.email,
        avatarUrl: values.avatar, // Use the Cloudinary URL from form
      };

      //console.log('Merged payload:', payload);

      // Call update API with the avatar URL (already uploaded to Cloudinary)
      const updated = await userService.updateProfile(payload);
      message.success('Profile updated successfully.');
      onSaved?.(updated);
    } catch (err: any) {
      //console.error('=== FORM SUBMIT ERROR ===');
      //console.error('Error:', err);
      //console.error('Error response:', err?.response);
      //console.error('Error response data:', err?.response?.data);
      message.error(err?.response?.data?.message || err?.message || 'Failed to update profile.');
    }
  };

  const beforeUpload = async (_file: RcFile) => {
    return false;
  };

  const onUploadChange = async (info: UploadChangeParam<UploadFile<any>>) => {
    const fileObj = info.file.originFileObj as File | undefined;
    if (!fileObj) return;

    try {
      // Validate file first
      const { validateImageFile, uploadImageToCloudinary } = await import('@/utils/cloudinary');
      const validationError = validateImageFile(fileObj);
      if (validationError) {
        message.error(validationError);
        return;
      }

      // Upload to Cloudinary immediately to get URL
      message.loading({ content: 'Uploading avatar...', key: 'avatar-upload' });
      const uploadedUrl = await uploadImageToCloudinary(fileObj);

      if (!uploadedUrl) {
        message.error({ content: 'Failed to upload avatar', key: 'avatar-upload' });
        return;
      }

      // Store the URL for later use when form is submitted
      setPreviewUrl(uploadedUrl);
      form.setFieldsValue({ avatar: uploadedUrl });

      message.success({ content: 'Avatar uploaded! Click "Save changes" to update your profile.', key: 'avatar-upload' });
    } catch (err: any) {
      message.error({ content: err?.message ?? 'Failed to upload avatar', key: 'avatar-upload' });
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
        name: initialUser?.fullname,
        email: initialUser?.email,
        avatar: initialUser?.avatarUrl,
      }}
      disabled={loading}
    >
      <Card title="Avatar" style={{ marginBottom: 16 }}>
        <Space align="center" size="large">
          <Avatar
            size={64}
            icon={<UserOutlined />}
            src={previewUrl || initialUser?.avatarUrl}
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
