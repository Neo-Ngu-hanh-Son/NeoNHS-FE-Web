import { VendorProfile } from '@/types';
import { ShopOutlined, EnvironmentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface VendorInfoCardProps {
    vendor: VendorProfile;
}

export function VendorInfoCard({ vendor }: VendorInfoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
            </div>

            <div className="space-y-5">
                <div className="group">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                        <ShopOutlined className="text-green-500" /> Business Name
                    </label>
                    <p className="text-lg text-gray-900 font-bold group-hover:text-green-600 transition-colors">
                        {vendor.businessName}
                    </p>
                </div>

                {vendor.description && (
                    <div className="group p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white">
                        <label className="text-sm font-medium text-gray-500 mb-2 block">Description</label>
                        <p className="text-base text-gray-700 leading-relaxed">{vendor.description}</p>
                    </div>
                )}

                {vendor.address && (
                    <div className="group">
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                            <EnvironmentOutlined className="text-red-500" /> Business Address
                        </label>
                        <p className="text-base text-gray-900 group-hover:text-green-600 transition-colors">
                            {vendor.address}
                        </p>
                    </div>
                )}

                <div className="pt-5 border-t border-gray-200">
                    <div className={`flex items-center gap-3 p-4 rounded-xl ${vendor.isVerified
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                        : 'bg-gradient-to-r from-gray-50 to-white'
                        }`}>
                        {vendor.isVerified ? (
                            <>
                                <CheckCircleOutlined className="text-green-500 text-2xl" />
                                <div>
                                    <span className="text-sm font-bold text-green-700 block">Verified Business</span>
                                    <span className="text-xs text-green-600">Your business has been verified</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <CheckCircleOutlined className="text-gray-400 text-2xl" />
                                <div>
                                    <span className="text-sm font-medium text-gray-600 block">Pending Verification</span>
                                    <span className="text-xs text-gray-500">Verification in progress</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
