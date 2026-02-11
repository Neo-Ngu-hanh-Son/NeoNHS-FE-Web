interface UserInfoCardProps {
    user: any;
}

export function UserInfoCard({ user }: UserInfoCardProps) {
    const stats = [
        { label: 'Orders', value: '12', icon: 'shopping_bag', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
        { label: 'Reviews', value: '5', icon: 'star', color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' },
        { label: 'Points visited', value: '28', icon: 'explore', color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
        { label: 'Vouchers', value: '3', icon: 'card_giftcard', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white px-1">Personal Activity</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow"
                    >
                        <div className={`${stat.color} p-3 rounded-full mb-3 flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
