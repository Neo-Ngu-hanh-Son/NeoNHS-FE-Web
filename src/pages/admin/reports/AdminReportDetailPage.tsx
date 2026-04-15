import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, message, Spin, Tag, Typography, Empty, Image } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    LeftOutlined,
    InfoCircleOutlined,
    LinkOutlined,
    ScheduleOutlined,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import adminReportService from '@/services/api/adminReportService';
import { AdminReport, ResolveReportRequest } from '@/types/adminReport';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

export default function AdminReportDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<AdminReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [handleNote, setHandleNote] = useState('');

    useEffect(() => {
        if (id) fetchReportDetail();
    }, [id]);

    const fetchReportDetail = async () => {
        setLoading(true);
        try {
            const data = await adminReportService.getReportDetail(id!);
            setReport(data);
            if (data.handleNote) setHandleNote(data.handleNote);
        } catch (error) {
            console.error('Failed to fetch report detail:', error);
            message.error('Failed to load report details');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (status: 'RESOLVED' | 'REJECTED') => {
        if (!handleNote.trim()) {
            message.warning('Please provide a resolution note');
            return;
        }

        setSubmitting(true);
        try {
            const request: ResolveReportRequest = {
                status,
                handleNote: handleNote.trim()
            };
            await adminReportService.resolveReport(id!, request);
            message.success(`Report ${status === 'RESOLVED' ? 'resolved' : 'rejected'} successfully`);
            navigate('/admin/reports');
        } catch (error) {
            console.error('Action failed:', error);
            message.error('Failed to update report status');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'gold';
            case 'RESOLVED': return 'green';
            case 'REJECTED': return 'red';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <Spin size="large" tip="Loading report details..." />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="max-w-4xl mx-auto p-8">
                <Empty description="Report not found">
                    <Button icon={<LeftOutlined />} onClick={() => navigate('/admin/reports')}>Back to Queue</Button>
                </Empty>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#E8F2ED] dark:bg-[#131f1a] p-4 md:p-8 font-display">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Breadcrumbs / Back */}
                <button
                    onClick={() => navigate('/admin/reports')}
                    className="flex items-center gap-2 text-[#688277] hover:text-[#1f6f4b] transition-colors font-medium text-sm"
                >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Moderation Queue
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#121715] dark:text-white">Report Case Analysis</h1>
                        <p className="text-[#688277] dark:text-gray-400 mt-1">
                            Reviewing: <span className="font-bold text-[#1f6f4b]">{report.targetName}</span>
                        </p>
                    </div>
                    <Tag
                        color={getStatusColor(report.status)}
                        className="px-6 py-2 m-0 rounded-full font-bold uppercase text-xs border-none shadow-sm"
                    >
                        {report.status}
                    </Tag>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Evidence & Description */}
                        <div className="bg-white dark:bg-[#1a2b24] p-8 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-black/5 dark:border-white/10">
                                <span className="material-symbols-outlined text-[#1f6f4b]">visibility</span>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-[#688277]">Evidence & Context</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Text strong className="text-xs text-[#688277] uppercase tracking-widest block mb-2">Reported Reason</Text>
                                    <Title level={4} className="m-0 dark:text-white">{report.reason}</Title>
                                </div>

                                <div>
                                    <Text strong className="text-xs text-[#688277] uppercase tracking-widest block mb-2">Detailed Description</Text>
                                    <Paragraph className="text-[#121715]/80 dark:text-gray-400 leading-relaxed text-base">
                                        {report.description}
                                    </Paragraph>
                                </div>

                                {report.evidenceUrl && (
                                    <div className="pt-4">
                                        <Text strong className="text-xs text-[#688277] uppercase tracking-widest block mb-3">Attached Evidence</Text>
                                        <div className="inline-block rounded-xl overflow-hidden border-4 border-white dark:border-[#23382f] shadow-md">
                                            <Image
                                                src={report.evidenceUrl}
                                                width={300}
                                                className="object-cover"
                                                alt="Report evidence"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-white dark:bg-[#1a2b24] p-8 rounded-2xl shadow-xl border-2 border-[#1f6f4b]/20 space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-black/5 dark:border-white/10">
                                <span className="material-symbols-outlined text-[#1f6f4b]">gavel</span>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-[#688277]">Resolution Actions</h2>
                            </div>

                            <div className="space-y-4">
                                <Text strong className="text-xs text-[#688277] uppercase tracking-widest block">Moderator Resolution Note</Text>
                                <TextArea
                                    rows={4}
                                    placeholder="Enter decision reasoning, internal notes, or message to the reporter..."
                                    value={handleNote}
                                    onChange={(e) => setHandleNote(e.target.value)}
                                    className="rounded-xl bg-[#F4F9F6] dark:bg-[#131f1a] border-black/5 dark:border-white/10 text-base"
                                    disabled={report.status !== 'PENDING'}
                                />

                                {report.status === 'PENDING' ? (
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<CheckCircleOutlined />}
                                            onClick={() => handleAction('RESOLVED')}
                                            loading={submitting}
                                            className="min-w-[160px] h-12 rounded-xl bg-[#1f6f4b] border-none font-bold shadow-lg shadow-[#1f6f4b]/20"
                                        >
                                            Resolve & Accept
                                        </Button>
                                        <Button
                                            danger
                                            size="large"
                                            icon={<CloseCircleOutlined />}
                                            onClick={() => handleAction('REJECTED')}
                                            loading={submitting}
                                            className="min-w-[160px] h-12 rounded-xl font-bold"
                                        >
                                            Reject Report
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="pt-4 flex items-center gap-2 p-4 bg-[#F4F9F6] dark:bg-[#131f1a] rounded-xl text-[#688277]">
                                        <span className="material-symbols-outlined">info</span>
                                        <Text className="text-[#688277]">This report has already been processed and is now {report.status.toLowerCase()}.</Text>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#1a2b24] p-6 rounded-2xl shadow-sm border border-black/5 dark:border-white/10 space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-black/5 dark:border-white/10">
                                <InfoCircleOutlined className="text-[#1f6f4b]" />
                                <h2 className="text-sm font-bold uppercase tracking-wider text-[#688277]">Metadata</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <Text className="text-xs text-[#688277] uppercase tracking-widest block mb-1">Target Account</Text>
                                    <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1f6f4b] transition-colors">
                                        <Text strong className="text-sm group-hover:text-[#1f6f4b]">{report.targetName}</Text>
                                        <LinkOutlined className="text-xs" />
                                    </div>
                                </div>

                                <div>
                                    <Text className="text-xs text-[#688277] uppercase tracking-widest block mb-1">Target Type</Text>
                                    <Tag color="cyan" className="rounded-full px-3">{report.targetType}</Tag>
                                </div>

                                <div>
                                    <Text className="text-xs text-[#688277] uppercase tracking-widest block mb-1">Reported By</Text>
                                    <div className="flex items-center gap-2">
                                        <UserOutlined className="text-[#688277]" />
                                        <Text strong className="text-sm">{report.reporterName}</Text>
                                    </div>
                                </div>

                                <div>
                                    <Text className="text-xs text-[#688277] uppercase tracking-widest block mb-1">Timestamp</Text>
                                    <div className="flex items-center gap-2">
                                        <ScheduleOutlined className="text-[#688277]" />
                                        <Text className="text-sm">{dayjs(report.createdAt).format('MMM D, YYYY HH:mm')}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1a2b24] p-6 rounded-2xl shadow-sm border border-black/5 dark:border-white/10">
                            <Paragraph className="text-xs text-[#688277] m-0 italic">
                                * Resolving a report will flag the content for immediate removal or secondary review by the safety team. Reporters will be notified of your decision.
                            </Paragraph>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
