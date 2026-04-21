import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import 'flag-icons/css/flag-icons.min.css';
export function App() {
  return <RouterProvider router={router} />;
}
