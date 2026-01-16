import { useEffect, useState } from "react";
import { Card, Tabs, Avatar, Space, Typography, Skeleton } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { TabsProps } from "antd";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { HomePage } from "@/pages/HomePage";
import { BlankLayout } from "@/layouts/BlankLayout";
import { AppLayout } from "@/layouts/AppLayout";
import authService from "@/services/api/authService";
import type { User } from "@/types";

const { Title, Text } = Typography;

export const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await authService.getCurrentUser();
        if (mounted) {
          // Normalize service response to local User type
          const normalized: User = {
            id: me?.id ?? "",
            name: me?.name ?? "User",
            email: me?.email ?? "",
            role: me?.role,
            avatar: me?.avatar,
          };
          setUser(normalized);
        }
      } catch {
        // If fetching fails, keep user null; UI will show minimal data and allow retry later (future enhancement)
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const items: TabsProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      children: (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Card title="Account Information" bordered>
            {loading ? (
              <Skeleton avatar paragraph={{ rows: 3 }} />
            ) : (
              <Space direction="vertical">
                <Space align="center" size="large">
                  <Avatar size={64} icon={<UserOutlined />} src={user?.avatar} />
                  <div>
                    <Title level={4} style={{ marginBottom: 0 }}>
                      {user?.name ?? "User"}
                    </Title>
                    <Text type="secondary">{user?.email ?? ""}</Text>
                  </div>
                </Space>
                <Space direction="vertical" size={4}>
                  <Text strong>Role</Text>
                  <Text>{user?.role ?? "—"}</Text>
                </Space>
              </Space>
            )}
          </Card>
        </Space>
      ),
    },
    {
      key: "security",
      label: "Security",
      children: (
        <Card title="Security Settings" bordered>
          <Space direction="vertical">
            <Text type="secondary">Security settings coming soon: password change, 2FA, sessions management.</Text>
          </Space>
        </Card>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        {loading ? (
          <Skeleton avatar active paragraph={{ rows: 1 }} />
        ) : (
          <Space align="center" size="large">
            <Avatar size={64} icon={<UserOutlined />} src={user?.avatar} />
            <div>
              <Title level={4} style={{ marginBottom: 0 }}>
                {user?.name ?? "User Account"}
              </Title>
              <Text type="secondary">{user?.email ?? ""}</Text>
            </div>
          </Space>
        )}
      </Card>

      <Card>
        <Tabs defaultActiveKey="profile" items={items} />
      </Card>
    </Space>
  );
};

export default ProfilePage;
