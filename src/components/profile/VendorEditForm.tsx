import { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { VendorProfile } from '@/types';
import VendorService from '@/services/api/vendorService';
import { MapPicker } from '@/components/common/MapPicker';
import { ProfileAvatar } from './ProfileAvatar';

const { TextArea } = Input;

interface VendorEditFormProps {
    vendor: VendorProfile;
    onSaved?: (vendor: VendorProfile) => void;
}

export function VendorEditForm({ vendor, onSaved }: VendorEditFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(
        vendor.latitude && vendor.longitude
            ? { lat: parseFloat(vendor.latitude), lng: parseFloat(vendor.longitude) }
            : undefined
    );

    useEffect(() => {
        form.setFieldsValue({
            businessName: vendor.businessName,
            description: vendor.description,
            address: vendor.address,
            taxCode: vendor.taxCode,
            bankName: vendor.bankName,
            bankAccountNumber: vendor.bankAccountNumber,
            bankAccountName: vendor.bankAccountName,
        });
    }, [vendor, form]);

    const handleLocationChange = (newLocation: { lat: number; lng: number }) => {
        setLocation(newLocation);
    };

    const handleAvatarUpload = async (file: File) => {
        setUploading(true);
        try {
            const { validateImageFile, uploadImageToCloudinary } = await import('@/utils/cloudinary');
            const validationError = validateImageFile(file);
            if (validationError) throw new Error(validationError);

            const avatarUrl = await uploadImageToCloudinary(file);
            if (!avatarUrl) throw new Error('Upload failed');

            const updated = await VendorService.updateVendorProfile({
                ...vendor,
                avatarUrl
            });
            message.success('Avatar updated successfully!');
            onSaved?.(updated);
        } catch (error: any) {
            message.error(error?.message || 'Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload: Partial<VendorProfile> = {
                ...vendor,
                ...values,
                latitude: location?.lat.toString(),
                longitude: location?.lng.toString(),
            };

            const response = await VendorService.updateVendorProfile(payload);

            // Merge current state with updates to ensure UI consistency
            const updatedVendor = {
                ...vendor,
                ...values,
                latitude: payload.latitude,
                longitude: payload.longitude,
                ...(response?.id ? response : {})
            };

            message.success('Business information updated successfully!');
            onSaved?.(updatedVendor);
        } catch (error: any) {
            message.error(error?.message || 'Failed to update business information');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
            {/* Left Column: Business Info */}
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-6">
                            <ProfileAvatar
                                src={vendor.avatarUrl}
                                alt={vendor.businessName}
                                size="lg"
                                onUpload={handleAvatarUpload}
                                loading={uploading}
                            />
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Business Profile</h2>
                                <p className="text-sm text-slate-500">Update your company photo and business details</p>
                            </div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800 flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-600 text-sm">verified</span>
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Verified Business</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Business Name</span>}
                                name="businessName"
                                rules={[{ required: true, message: 'Required' }]}
                            >
                                <Input className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Registered Category</span>}
                            >
                                <Input disabled value="Eco-Tourism & Cultural Workshops" className="w-full px-4 py-2.5 border-none bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed italic font-medium" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</span>}
                            name="description"
                        >
                            <TextArea
                                rows={4}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Business Address</span>}
                            name="address"
                        >
                            <Input
                                prefix={<span className="material-symbols-outlined text-rose-500 text-lg mr-2">location_on</span>}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:border-primary"
                                placeholder="Enter business address..."
                            />
                        </Form.Item>

                        <div className="py-4">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Location on Map</span>
                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
                                <MapPicker value={location} onChange={handleLocationChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Banking info & Sidebar */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Banking Information</h2>

                    <div className="space-y-4">
                        <Form.Item
                            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tax Code / ID</span>}
                            name="taxCode"
                        >
                            <Input className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bank Name</span>}
                            name="bankName"
                        >
                            <Input className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Number</span>}
                            name="bankAccountNumber"
                        >
                            <Input className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono" />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Beneficiary Name</span>}
                            name="bankAccountName"
                        >
                            <Input className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase" />
                        </Form.Item>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            className="bg-primary hover:bg-primary/90 text-white h-12 rounded-lg text-sm font-bold shadow-md shadow-primary/20 transition-all active:scale-95"
                        >
                            Save All Business Details
                        </Button>
                        <button
                            type="button"
                            onClick={() => {
                                form.setFieldsValue({
                                    businessName: vendor.businessName,
                                    description: vendor.description,
                                    address: vendor.address,
                                    taxCode: vendor.taxCode,
                                    bankName: vendor.bankName,
                                    bankAccountNumber: vendor.bankAccountNumber,
                                    bankAccountName: vendor.bankAccountName,
                                });
                                setLocation(vendor.latitude && vendor.longitude
                                    ? { lat: parseFloat(vendor.latitude), lng: parseFloat(vendor.longitude) }
                                    : undefined);
                            }}
                            className="w-full mt-4 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            Cancel Changes
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-100 dark:border-blue-900/20">
                    <div className="flex items-center gap-3 text-blue-700 dark:text-blue-400 mb-3">
                        <span className="material-symbols-outlined">info</span>
                        <span className="font-bold">Security Tip</span>
                    </div>
                    <p className="text-sm text-blue-600/80 dark:text-blue-400/60 leading-relaxed">
                        Ensure your banking details match your official registration documents to avoid payment delays.
                    </p>
                </div>
            </div>
        </Form>
    );
}
