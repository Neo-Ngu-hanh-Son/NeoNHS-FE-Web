/**
 * Custom Hook: useAuth
 * Re-export từ AuthContext để backward compatibility
 */

export { useAuth } from '@/contexts/AuthContext';
export default { useAuth: () => import('@/contexts/AuthContext').then(m => m.useAuth) };
