import { useState, useEffect } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { VendorProfile } from '@/types';
import { motion } from 'framer-motion';
import VendorService from '@/services/api/vendorService';
import { MapPicker } from '@/components/common/MapPicker';

const { TextArea } = Input;

interface VendorEditFormProps {
    vendor: VendorProfile;
    onSaved?: (vendor: VendorProfile) => void;
}

export function VendorEditForm({ vendor, onSaved }: VendorEditFormProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload: Partial<VendorProfile> = {
                ...vendor,
                ...values,
                latitude: location?.lat.toString(),
                longitude: location?.lng.toString(),
            };

            const updated = await VendorService.updateVendorProfile(payload);
            message.success({ content: 'Business information updated successfully!', key: 'vendor-update' });
            onSaved?.(updated);
        } catch (error: any) {
            message.error({ content: error?.message || 'Failed to update business information', key: 'vendor-update' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Edit Business Information</h2>
            </div>

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    businessName: vendor.businessName,
                    description: vendor.description,
                    address: vendor.address,
                    taxCode: vendor.taxCode,
                    bankName: vendor.bankName,
                    bankAccountNumber: vendor.bankAccountNumber,
                    bankAccountName: vendor.bankAccountName,
                }}
                onFinish={handleSubmit}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        label={<span className="text-sm font-semibold text-gray-700">Business Name</span>}
                        name="businessName"
                        rules={[
                            { required: true, message: 'Please enter your business name' },
                            { min: 3, message: 'Business name must be at least 3 characters' },
                        ]}
                        className="md:col-span-2"
                    >
                        <Input
                            placeholder="Enter your shop name"
                            size="large"
                            className="rounded-xl border-gray-300 hover:border-green-400 focus:border-green-500 transition-colors"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-sm font-semibold text-gray-700">Description</span>}
                        name="description"
                        className="md:col-span-2"
                    >
                        <TextArea
                            placeholder="Describe your business"
                            rows={4}
                            maxLength={500}
                            showCount
                            className="rounded-xl border-gray-300 hover:border-green-400 focus:border-green-500 transition-colors"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-sm font-semibold text-gray-700">Business Address</span>}
                        name="address"
                        className="md:col-span-2"
                    >
                        <Input
                            placeholder="Enter your business address"
                            size="large"
                            className="rounded-xl border-gray-300 hover:border-green-400 focus:border-green-500 transition-colors"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-sm font-semibold text-gray-700">Tax Code</span>}
                        name="taxCode"
                    >
                        <Input
                            placeholder="Enter tax code"
                            size="large"
                            className="rounded-xl border-gray-300 hover:border-green-400 focus:border-green-500 transition-colors"
                        />
                    </Form.Item>

                    <Divider className="md:col-span-2 my-2">Bank Information</Divider>

                    <Form.Item
                        label={<span className="text-sm font-semibold text-gray-700">Bank Name</span>}
                        name="bankName"
                    >
                        <Input
                            placeholder="e.g. Vietcombank"
                            size="large"
                            className="rounded-xl border-gray-300 hover:border-green-400 focus:border-green-500 transition-colors"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-sm font-semibold text-gray-700">Account Number</span>}
                        name="bankAccountNumber"
                    >
                        <Input
                            placeholder="Enter bank account number"
                            size="large"
                            className="rounded-xl border-gray-300 hover:border-green-400 focus:border-green-500 transition-colors"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-sm font-semibold text-gray-700">Account Name</span>}
                        name="bankAccountName"
                        className="md:col-span-2"
                    >
                        <Input
                            placeholder="Enter bank account name"
                            size="large"
                            className="rounded-xl border-gray-300 hover:border-green-400 focus:border-green-500 transition-colors"
                        />
                    </Form.Item>
                </div>

                <Divider className="my-2">Location on Map</Divider>
                <div className="mb-6">
                    <MapPicker value={location} onChange={handleLocationChange} />
                </div>

                <div className="flex gap-3 mt-6">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-none shadow-lg shadow-green-500/50 font-semibold"
                    >
                        Save Changes
                    </Button>
                    <Button
                        onClick={() => {
                            form.resetFields();
                            setLocation(vendor.latitude && vendor.longitude
                                ? { lat: parseFloat(vendor.latitude), lng: parseFloat(vendor.longitude) }
                                : undefined);
                        }}
                        size="large"
                        className="h-12 rounded-xl border-2 border-gray-300 hover:border-green-500 hover:text-green-600 font-semibold"
                    >
                        Reset
                    </Button>
                </div>
            </Form>
        </motion.div>
    );
}
