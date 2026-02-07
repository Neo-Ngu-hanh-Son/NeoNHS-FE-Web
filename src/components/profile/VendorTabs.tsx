import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { ShopOutlined, AppstoreOutlined, DollarOutlined, SettingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

export function VendorTabs() {
    const items: TabsProps['items'] = [
        {
            key: 'orders',
            label: (
                <span className="flex items-center gap-2 font-medium">
                    <ShopOutlined />
                    Orders
                </span>
            ),
            children: (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                >
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShopOutlined className="text-4xl text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h3>
                        <p className="text-gray-600">Order list and management features coming soon...</p>
                    </div>
                </motion.div>
            ),
        },
        {
            key: 'products',
            label: (
                <span className="flex items-center gap-2 font-medium">
                    <AppstoreOutlined />
                    Products
                </span>
            ),
            children: (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                >
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AppstoreOutlined className="text-4xl text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Product Management</h3>
                        <p className="text-gray-600">Product list and management features coming soon...</p>
                    </div>
                </motion.div>
            ),
        },
        {
            key: 'revenue',
            label: (
                <span className="flex items-center gap-2 font-medium">
                    <DollarOutlined />
                    Revenue
                </span>
            ),
            children: (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                >
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DollarOutlined className="text-4xl text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Revenue Analytics</h3>
                        <p className="text-gray-600">Revenue charts and statistics coming soon...</p>
                    </div>
                </motion.div>
            ),
        },
        {
            key: 'settings',
            label: (
                <span className="flex items-center gap-2 font-medium">
                    <SettingOutlined />
                    Settings
                </span>
            ),
            children: (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                >
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <SettingOutlined className="text-4xl text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Settings</h3>
                        <p className="text-gray-600">Business configuration settings coming soon...</p>
                    </div>
                </motion.div>
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
        >
            <Tabs
                defaultActiveKey="orders"
                items={items}
                size="large"
                className="vendor-tabs"
            />
        </motion.div>
    );
}
