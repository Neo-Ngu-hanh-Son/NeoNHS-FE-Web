import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import adminReportService from '@/services/api/adminReportService';
import { AdminReport, ReportFilter, ReportStatus, ReportTargetType, SpringPage } from '@/types/adminReport';
import { Tag, Select, Button, Empty, Spin, message, Pagination } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Option } = Select;

export default function AdminReportsPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [reports, setReports] = useState<AdminReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(9);

    // Filters from URL
    const statusFilter = (searchParams.get('status') as ReportStatus) || 'ALL';
    const typeFilter = (searchParams.get('targetType') as ReportTargetType) || 'ALL';
    const searchTerm = searchParams.get('q') || '';

    useEffect(() => {
        setPage(1);
    }, [statusFilter, typeFilter, searchTerm]);

    useEffect(() => {
        fetchReports();
    }, [statusFilter, typeFilter, searchTerm, page]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const filter: ReportFilter = {
                status: statusFilter === ('ALL' as any) ? undefined : statusFilter,
                targetType: typeFilter === 'ALL' ? undefined : typeFilter,
                reporterName: searchTerm || undefined,
                page: page - 1,
                size: pageSize
            };
            const response: SpringPage<AdminReport> = await adminReportService.getReports(filter);
            setReports(response.content || []);
            setTotal(response.totalElements || 0);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
            message.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value && value !== 'ALL') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const getStatusColor = (status: ReportStatus) => {
        switch (status) {
            case 'PENDING': return 'gold';
            case 'REVIEWING': return 'blue';
            case 'RESOLVED': return 'green';
            case 'REJECTED': return 'red';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: ReportStatus) => {
        switch (status) {
            case 'PENDING': return 'Pending';
            case 'REVIEWING': return 'Reviewing';
            case 'RESOLVED': return 'Resolved';
            case 'REJECTED': return 'Rejected';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-[#E8F2ED] dark:bg-[#131f1a] font-display text-[#121715] dark:text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-12 bg-[#1f6f4b] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Reports Hub</h2>
                            <p className="text-[#688277] dark:text-gray-400 text-sm">Review and moderate platform reports ({total})</p>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white dark:bg-[#1a2b24] p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative w-full lg:max-w-md">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#688277]">search</span>
                        <input
                            type="text"
                            placeholder="Search by reporter name..."
                            className="w-full pl-12 pr-4 h-12 bg-transparent border border-black/5 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-[#1f6f4b]/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => handleFilterChange('q', e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                        <Select
                            value={typeFilter}
                            onChange={(val) => handleFilterChange('targetType', val)}
                            className="min-w-[140px] h-12"
                            placeholder="All Categories"
                        >
                            <Option value="ALL">All Categories</Option>
                            <Option value="POINT">Points</Option>
                            <Option value="EVENT">Events</Option>
                            <Option value="WORKSHOP">Workshops</Option>
                        </Select>

                        <Select
                            value={statusFilter}
                            onChange={(val) => handleFilterChange('status', val)}
                            className="min-w-[140px] h-12"
                            placeholder="All Status"
                        >
                            <Option value="ALL">All Status</Option>
                            <Option value="PENDING">Pending</Option>
                            <Option value="REVIEWING">Reviewing</Option>
                            <Option value="RESOLVED">Resolved</Option>
                            <Option value="REJECTED">Rejected</Option>
                        </Select>

                        <Button
                            icon={<FilterOutlined />}
                            type="primary"
                            className="h-12 px-6 rounded-xl bg-[#1f6f4b] border-none hover:bg-[#1f6f4b]/90 shadow-md shadow-[#1f6f4b]/20 transition-all font-semibold"
                            onClick={fetchReports}
                        >
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Reports Grid */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Spin size="large" />
                        </div>
                    ) : reports.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {reports.map((report) => (
                                <motion.div
                                    key={report.id}
                                    layout
                                    className="bg-[#F4F9F6] dark:bg-[#1a2b24] rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col gap-5 group relative"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="size-14 bg-white dark:bg-[#23382f] rounded-xl flex items-center justify-center text-[#1f6f4b] shadow-sm">
                                            <span className="material-symbols-outlined text-3xl">
                                                {report.targetType === 'WORKSHOP' ? 'celebration' :
                                                    report.targetType === 'EVENT' ? 'event' : 'location_on'}
                                            </span>
                                        </div>
                                        <Tag color={getStatusColor(report.status)} className="px-3 py-1 m-0 rounded-full font-bold uppercase text-[10px] border-none">
                                            {getStatusLabel(report.status)}
                                        </Tag>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-[#688277] uppercase tracking-wider">{report.targetType}</span>
                                            <span className="text-[#688277]">•</span>
                                            <span className="text-xs font-medium text-[#688277] truncate max-w-[150px]">{report.targetName}</span>
                                        </div>
                                        <h3 className="text-lg font-bold line-clamp-1 group-hover:text-[#1f6f4b] transition-colors">{report.reason}</h3>
                                        <p className="text-[#688277] dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                                            {report.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-5 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[#688277] dark:text-gray-400">
                                                <span className="material-symbols-outlined text-sm">person</span>
                                                <span className="text-xs font-medium">{report.reporterName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[#688277] dark:text-gray-400">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                <span className="text-xs font-medium">{dayjs(report.createdAt).fromNow()}</span>
                                            </div>
                                        </div>
                                        <Button
                                            type="primary"
                                            className="h-10 px-5 rounded-lg bg-[#1f6f4b] border-none hover:bg-[#1f6f4b]/90 transition-all font-bold text-sm"
                                            onClick={() => navigate(`/admin/reports/${report.id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="bg-white dark:bg-[#1a2b24] rounded-2xl p-20 border border-black/5 dark:border-white/10 flex flex-col items-center justify-center text-center">
                            <Empty description="No reports found matching your filters." />
                        </div>
                    )}
                </AnimatePresence>

                {/* Pagination */}
                {total > pageSize && (
                    <div className="flex justify-center pt-8">
                        <Pagination
                            current={page}
                            total={total}
                            pageSize={pageSize}
                            onChange={(p) => setPage(p)}
                            showSizeChanger={false}
                            className="bg-white dark:bg-[#1a2b24] p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/10"
                        />
                    </div>
                )}

                {/* Footer Stats */}
                <footer className="pt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 opacity-80">
                    <div className="flex flex-col gap-1">
                        <p className="text-[#688277] text-[10px] uppercase font-bold tracking-widest">Total Reports</p>
                        <p className="text-2xl font-bold">{total}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[#688277] text-[10px] uppercase font-bold tracking-widest">Pending</p>
                        <p className="text-2xl font-bold text-amber-600">{reports.filter(r => r.status === 'PENDING').length}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[#688277] text-[10px] uppercase font-bold tracking-widest">Reviewing</p>
                        <p className="text-2xl font-bold text-blue-600">{reports.filter(r => r.status === 'REVIEWING').length}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[#688277] text-[10px] uppercase font-bold tracking-widest">Resolved</p>
                        <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.status === 'RESOLVED').length}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-[#688277] text-[10px] uppercase font-bold tracking-widest">Rejected</p>
                        <p className="text-2xl font-bold text-red-600">{reports.filter(r => r.status === 'REJECTED').length}</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
