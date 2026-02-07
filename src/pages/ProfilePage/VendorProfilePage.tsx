import { useEffect, useState } from 'react';
import { message } from 'antd';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { VendorInfoCard } from '@/components/profile/VendorInfoCard';
import { VendorEditForm } from '@/components/profile/VendorEditForm';
import type { User, VendorProfile } from '@/types';
import VendorService from '@/services/api/vendorService';
import { useAuth } from '@/hooks/useAuth';

export default function VendorProfilePage() {
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
        updateUser(updatedVendor as unknown as User);
    };

    const handleAvatarUpload = async (file: File) => {
        if (!user || !vendor) return;

        try {
            const { validateImageFile, uploadImageToCloudinary } = await import('@/utils/cloudinary');
            const validationError = validateImageFile(file);
            if (validationError) {
                throw new Error(validationError);
            }

            const avatarUrl = await uploadImageToCloudinary(file);
            if (!avatarUrl) {
                throw new Error('Failed to upload avatar to Cloudinary');
            }

            const updated = await VendorService.updateVendorProfile({
                ...vendor,
                avatarUrl
            });
            setVendor(updated);
            updateUser(updated as unknown as User);
            message.success('Avatar updated successfully!');
        } catch (error: any) {
            message.error(error?.message || 'Failed to upload avatar');
            throw error;
        }
    };

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">Failed to load vendor data. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Vendor Profile</h1>
                <p className="text-[#588d70]">Manage your official business documents and shop information</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Profile Header section */}
                <div className="bg-white dark:bg-zinc-900 p-1 rounded-2xl shadow-sm border border-[#d3e4da] dark:border-white/10">
                    <ProfileHeader
                        user={user}
                        onAvatarUpload={handleAvatarUpload}
                    />
                </div>

                {/* Vendor Info & Edit section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <VendorInfoCard vendor={vendor} />
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-[#d3e4da] dark:border-white/10 shadow-sm transition-all h-full">
                            <VendorEditForm vendor={vendor} onSaved={handleVendorSaved} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
