import { message } from 'antd';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserInfoCard } from '@/components/profile/UserInfoCard';
import { UserEditForm } from '@/components/profile/UserEditForm';
import { userService } from '@/services/api/userService';
import type { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export function UserProfilePage() {
    const { user, updateUser } = useAuth();

    const handleProfileSaved = (updatedUser: User) => {
        updateUser(updatedUser);
    };

    const handleAvatarUpload = async (file: File) => {
        if (!user) return;

        try {
            // Upload to Cloudinary first
            const { validateImageFile, uploadImageToCloudinary } = await import('@/utils/cloudinary');

            // Validate file
            const validationError = validateImageFile(file);
            if (validationError) {
                throw new Error(validationError);
            }

            // Upload to Cloudinary
            const avatarUrl = await uploadImageToCloudinary(file);
            if (!avatarUrl) {
                throw new Error('Failed to upload avatar to Cloudinary');
            }

            // Update profile with the new avatar URL
            const updated = await userService.updateProfile({
                ...user,
                avatarUrl
            });
            updateUser(updated);
            message.success('Avatar updated successfully!');
        } catch (error: any) {
            message.error(error?.message || 'Failed to upload avatar');
            throw error; // Re-throw to let ProfileAvatar component handle loading state
        }
    };

    if (!user) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600">Manage your personal information and preferences</p>
            </div>

            {/* Profile Header */}
            <div className="mb-6">
                <ProfileHeader
                    user={user}
                    onAvatarUpload={handleAvatarUpload}
                />
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserInfoCard user={user} />
                <UserEditForm user={user} onSaved={handleProfileSaved} />
            </div>
        </DashboardLayout>
    );
}

export default UserProfilePage;
