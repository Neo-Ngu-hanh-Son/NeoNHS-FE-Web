// import type {
//     NotificationItem,
//     RevenuePoint,
//     RevenueFilter,
//     Transaction,
//     Workshop,
//     WorkshopReview,
//     WorkshopStatusPoint,
// } from './types';

// export const revenueByFilter: Record<RevenueFilter, RevenuePoint[]> = {
//     week: [
//         { name: 'Mon', revenue: 1200 },
//         { name: 'Tue', revenue: 2100 },
//         { name: 'Wed', revenue: 800 },
//         { name: 'Thu', revenue: 1600 },
//         { name: 'Fri', revenue: 2400 },
//         { name: 'Sat', revenue: 3200 },
//         { name: 'Sun', revenue: 2800 },
//     ],
//     month: [
//         { name: 'Week 1', revenue: 8200 },
//         { name: 'Week 2', revenue: 12500 },
//         { name: 'Week 3', revenue: 9800 },
//         { name: 'Week 4', revenue: 14200 },
//     ],
//     year: [
//         { name: 'Jan', revenue: 32000 },
//         { name: 'Feb', revenue: 28000 },
//         { name: 'Mar', revenue: 45000 },
//         { name: 'Apr', revenue: 38000 },
//         { name: 'May', revenue: 52000 },
//         { name: 'Jun', revenue: 48000 },
//         { name: 'Jul', revenue: 61000 },
//         { name: 'Aug', revenue: 55000 },
//         { name: 'Sep', revenue: 42000 },
//         { name: 'Oct', revenue: 58000 },
//         { name: 'Nov', revenue: 67000 },
//         { name: 'Dec', revenue: 72000 },
//     ],
// };

// export const workshopStatusData: WorkshopStatusPoint[] = [
//     { name: 'Active', value: 12, fill: 'var(--color-active)' },
//     { name: 'Pending', value: 5, fill: 'var(--color-pending)' },
//     { name: 'Register', value: 8, fill: 'var(--color-register)' },
//     { name: 'Draft', value: 3, fill: 'var(--color-draft)' },
// ];

// export const transactions: Transaction[] = [
//     { id: 'TXN-001', workshop: 'Pottery Making', customer: 'John Doe', amount: 150, date: '2026-03-05', status: 'completed' },
//     { id: 'TXN-002', workshop: 'Silk Weaving', customer: 'Jane Smith', amount: 200, date: '2026-03-04', status: 'completed' },
//     { id: 'TXN-003', workshop: 'Cooking Class', customer: 'Mike Brown', amount: 85, date: '2026-03-04', status: 'pending' },
//     { id: 'TXN-004', workshop: 'Lantern Making', customer: 'Sarah Lee', amount: 120, date: '2026-03-03', status: 'completed' },
//     { id: 'TXN-005', workshop: 'Pottery Making', customer: 'Tom Wilson', amount: 150, date: '2026-03-03', status: 'refunded' },
//     { id: 'TXN-006', workshop: 'Silk Weaving', customer: 'Anna Nguyen', amount: 200, date: '2026-03-02', status: 'completed' },
// ];

// export const workshopReviews: WorkshopReview[] = [
//     { workshop: 'Pottery Making', totalReviews: 128, avgRating: 4.8, recent: '+12 this week' },
//     { workshop: 'Silk Weaving', totalReviews: 95, avgRating: 4.6, recent: '+8 this week' },
//     { workshop: 'Cooking Class', totalReviews: 72, avgRating: 4.9, recent: '+5 this week' },
//     { workshop: 'Lantern Making', totalReviews: 64, avgRating: 4.3, recent: '+3 this week' },
//     { workshop: 'Bamboo Craft', totalReviews: 41, avgRating: 4.5, recent: '+2 this week' },
// ];

// export const workshops: Workshop[] = [
//     {
//         id: 1,
//         name: 'Pottery Making',
//         sessions: [
//             { date: new Date(2026, 2, 5), time: '09:00 - 11:00', slots: 8 },
//             { date: new Date(2026, 2, 7), time: '14:00 - 16:00', slots: 5 },
//             { date: new Date(2026, 2, 10), time: '09:00 - 11:00', slots: 10 },
//         ],
//     },
//     {
//         id: 2,
//         name: 'Silk Weaving',
//         sessions: [
//             { date: new Date(2026, 2, 6), time: '10:00 - 12:00', slots: 6 },
//             { date: new Date(2026, 2, 9), time: '10:00 - 12:00', slots: 4 },
//         ],
//     },
//     {
//         id: 3,
//         name: 'Cooking Class',
//         sessions: [
//             { date: new Date(2026, 2, 5), time: '15:00 - 17:00', slots: 12 },
//             { date: new Date(2026, 2, 8), time: '15:00 - 17:00', slots: 10 },
//         ],
//     },
//     {
//         id: 4,
//         name: 'Lantern Making',
//         sessions: [{ date: new Date(2026, 2, 11), time: '09:00 - 11:00', slots: 15 }],
//     },
// ];

// export const notifications: NotificationItem[] = [
//     { id: 1, type: 'booking', message: 'New booking for Pottery Making by John Doe', time: '5 min ago', read: false },
//     { id: 2, type: 'system', message: 'Your workshop "Silk Weaving" has been approved', time: '1 hour ago', read: false },
//     { id: 3, type: 'review', message: 'New 5-star review on Cooking Class', time: '2 hours ago', read: false },
//     { id: 4, type: 'payment', message: 'Payment of $200 received for Silk Weaving', time: '3 hours ago', read: true },
//     { id: 5, type: 'system', message: 'System maintenance scheduled for March 10', time: '5 hours ago', read: true },
//     { id: 6, type: 'booking', message: 'Booking cancelled for Lantern Making by Tom', time: '6 hours ago', read: true },
//     { id: 7, type: 'review', message: 'New 4-star review on Pottery Making', time: '1 day ago', read: true },
// ];
