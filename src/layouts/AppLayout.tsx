import { Layout, Menu, Typography } from 'antd'
import { Link, Outlet, useLocation } from 'react-router-dom'

const { Header, Content, Footer } = Layout

export function AppLayout() {
  const { pathname } = useLocation()
  const selectedKey = pathname === '/login' ? 'login' : 'home'

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between !bg-white border-b border-slate-200">
        <Link to="/">
          <Typography.Text className="font-semibold">CCTE FE</Typography.Text>
        </Link>
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={[
            { key: 'home', label: <Link to="/">Home</Link> },
            { key: 'login', label: <Link to="/login">Login</Link> },
          ]}
        />
      </Header>

      <Content className="w-full p-0">
        <Outlet />
      </Content>

      <Footer className="text-center text-slate-500">
        CCTE FE © {new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}


