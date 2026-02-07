import { User } from '@/types';
import { ProfileAvatar } from './ProfileAvatar';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
    user: User;
    onAvatarUpload?: (file: File) => Promise<void>;
    loading?: boolean;
}

export function ProfileHeader({ user, onAvatarUpload, loading }: ProfileHeaderProps) {
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/50';
            case 'VENDOR':
                return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50';
            case 'TOURIST':
            default:
                return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
        >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <ProfileAvatar
                    src={user.avatarUrl}
                    alt={user.fullname}
                    size="lg"
                    onUpload={onAvatarUpload}
                    loading={loading}
                />

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                        {user.fullname}
                    </h1>
                    <p className="text-gray-600 mb-4 text-lg">{user.email}</p>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)} transform hover:scale-105 transition-transform duration-200`}>
                            {user.role}
                        </span>
                        {user.isVerified && (
                            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50 transform hover:scale-105 transition-transform duration-200">
                                ✓ Verified
                            </span>
                        )}
                        {!user.isActive && (
                            <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                Inactive
                            </span>
                        )}
                        {user.isBanned && (
                            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50">
                                Banned
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
