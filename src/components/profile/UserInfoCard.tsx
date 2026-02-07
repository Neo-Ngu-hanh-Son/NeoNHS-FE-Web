import { User } from '@/types';
import { MailOutlined, PhoneOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

interface UserInfoCardProps {
    user: User;
}

export function UserInfoCard({ user }: UserInfoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
            </div>

            <div className="space-y-5">
                <div className="group">
                    <label className="text-sm font-medium text-gray-500 mb-1 block">Full Name</label>
                    <p className="text-lg text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                        {user.fullname}
                    </p>
                </div>

                <div className="group">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                        <MailOutlined className="text-blue-500" /> Email
                    </label>
                    <p className="text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                        {user.email}
                    </p>
                </div>

                {user.phoneNumber && (
                    <div className="group">
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1">
                            <PhoneOutlined className="text-green-500" /> Phone Number
                        </label>
                        <p className="text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                            {user.phoneNumber}
                        </p>
                    </div>
                )}

                <div className="pt-5 border-t border-gray-200">
                    <label className="text-sm font-medium text-gray-500 mb-3 block">Account Status</label>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white">
                            {user.isActive ? (
                                <CheckCircleOutlined className="text-green-500 text-xl" />
                            ) : (
                                <CloseCircleOutlined className="text-gray-400 text-xl" />
                            )}
                            <span className={`text-sm font-medium ${user.isActive ? 'text-green-700' : 'text-gray-600'}`}>
                                {user.isActive ? 'Active Account' : 'Inactive Account'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white">
                            {user.isVerified ? (
                                <CheckCircleOutlined className="text-green-500 text-xl" />
                            ) : (
                                <CloseCircleOutlined className="text-gray-400 text-xl" />
                            )}
                            <span className={`text-sm font-medium ${user.isVerified ? 'text-green-700' : 'text-gray-600'}`}>
                                {user.isVerified ? 'Email Verified' : 'Email Not Verified'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
