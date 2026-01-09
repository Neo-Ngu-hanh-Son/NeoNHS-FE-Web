import { AntdProvider } from '@/config/providers/AntdProvider'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'

export function App() {
  return (
    <AntdProvider>
      <RouterProvider router={router} />
    </AntdProvider>
  )
}


