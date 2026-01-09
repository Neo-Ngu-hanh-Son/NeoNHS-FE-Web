import { AntdProvider } from '@/app/providers/AntdProvider'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'

export function App() {
  return (
    <AntdProvider>
      <RouterProvider router={router} />
    </AntdProvider>
  )
}


