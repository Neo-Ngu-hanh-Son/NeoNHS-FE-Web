import { useEffect, useState } from 'react';
import { message } from 'antd';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { VendorInfoCard } from '@/components/profile/VendorInfoCard';
import { VendorEditForm } from '@/components/profile/VendorEditForm';
import { VendorTabs } from '@/components/profile/VendorTabs';
import type { User, VendorProfile } from '@/types';
import VendorService from '@/services/api/vendorService';
import { useAuth } from '@/hooks/useAuth';

export function VendorProfilePage() {
    const { user, updateUser } = useAuth();
    const [vendor, setVendor] = useState<VendorProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadVendorData();
        }
    }, [user]);

    const loadVendorData = async () => {
        try {
            const vendorData = await VendorService.getVendorProfile();
            setVendor(vendorData);
        } catch (error: any) {
            message.error('Failed to load vendor data');
        } finally {
            setLoading(false);
        }
    };

    const handleVendorSaved = (updatedVendor: VendorProfile) => {
        setVendor(updatedVendor);
        // If vendor profile update also updates user fields (fullname, phone, avatar), sync it
        // However, the backend returns VendorProfile which includes User fields in this case
        updateUser(updatedVendor as unknown as User);
    };

    const handleAvatarUpload = async (file: File) => {
        if (!user || !vendor) return;

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

            // Update vendor profile with the new avatar URL
            const updated = await VendorService.updateVendorProfile({
                ...vendor,
                avatarUrl
            });
            setVendor(updated);
            updateUser(updated as unknown as User);
            message.success('Avatar updated successfully!');
        } catch (error: any) {
            message.error(error?.message || 'Failed to upload avatar');
            throw error; // Re-throw to let ProfileAvatar component handle loading state
        }
    };

    if (loading || !user) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!vendor) {
        return (
            <DashboardLayout>
                <div className="text-center py-8">
                    <p className="text-gray-600">Failed to load vendor data. Please try again.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Profile</h1>
                <p className="text-gray-600">Manage your shop information and business details</p>
            </div>

            {/* Profile Header */}
            <div className="mb-6">
                <ProfileHeader
                    user={user}
                    onAvatarUpload={handleAvatarUpload}
                />
            </div>

            {/* Vendor Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <VendorInfoCard vendor={vendor} />
                <VendorEditForm vendor={vendor} onSaved={handleVendorSaved} />
            </div>

            {/* Vendor Tabs */}
            <VendorTabs />
        </DashboardLayout>
    );
}

export default VendorProfilePage;
