import { useMemo, useState } from 'react';
import { Row, Col } from 'antd'; // Import thêm Row, Col từ antd
import {
    DashboardStatsRow,
    NotificationsCard,
    RevenueOverviewCard,
    TransactionsCard,
    WorkshopReviewsCard,
    WorkshopSessionsCard,
    WorkshopStatusCard,
} from './components';
import {
    notifications,
    revenueByFilter,
    transactions,
    workshopReviews,
    workshops,
    workshopStatusData,
} from './data';
import type { RevenueFilter } from './types';

export default function VendorDashboardPage() {
    const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>('week');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const revenueData = useMemo(() => revenueByFilter[revenueFilter], [revenueFilter]);

    const sessionDates = useMemo(() => {
        return workshops.flatMap((w) => w.sessions.map((s) => new Date(s.date)));
    }, []);

    const selectedDaySessions = useMemo(() => {
        if (!selectedDate) {
            return [];
        }

        const targetDate = selectedDate.toDateString();
        return workshops
            .flatMap((w) =>
                w.sessions
                    .filter((s) => new Date(s.date).toDateString() === targetDate)
                    .map((s) => ({
                        workshopName: w.name,
                        workshopId: w.id,
                        time: s.time,
                        slots: s.slots,
                        date: s.date,
                    }))
            )
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [selectedDate]);

    return (
        <div className="p-4">
            {/* Gutter [16, 16] tạo khoảng cách 16px giữa các cột và hàng. 
                Bạn có thể đổi thành [0, 0] nếu muốn sát rạt như CSS Grid cũ */}
            <Row gutter={[16, 16]} align="stretch">

                {/* ── KHU VỰC BÊN TRÁI ── */}
                <Col xs={24} xl={16} style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* Hàng 1: Stats */}
                    <Row gutter={[16, 16]}>
                        <DashboardStatsRow />
                    </Row>

                    {/* Hàng 2: Biểu đồ doanh thu & Trạng thái Workshop */}
                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} lg={15} style={{ display: 'flex', minHeight: '400px' }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <RevenueOverviewCard
                                    revenueFilter={revenueFilter}
                                    onRevenueFilterChange={setRevenueFilter}
                                    revenueData={revenueData}
                                />
                            </div>
                        </Col>
                        <Col xs={24} lg={9} style={{ display: 'flex', minHeight: '400px' }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <WorkshopStatusCard data={workshopStatusData} />
                            </div>
                        </Col>
                    </Row>

                    {/* Hàng 3: Bảng giao dịch & Đánh giá (Thêm flex: 1 để đẩy dãn xuống đáy) */}
                    <Row gutter={[16, 16]} style={{ marginTop: 16, flex: 1 }}>
                        <Col xs={24} lg={15} style={{ display: 'flex' }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <TransactionsCard transactions={transactions} />
                            </div>
                        </Col>
                        <Col xs={24} lg={9} style={{ display: 'flex' }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <WorkshopReviewsCard reviews={workshopReviews} />
                            </div>
                        </Col>
                    </Row>

                </Col>

                {/* ── KHU VỰC BÊN PHẢI ── */}
                <Col xs={24} xl={8} style={{ display: 'flex', flexDirection: 'column' }}>

                    {/* Lịch & Phiên Workshop (Phía trên) */}
                    <div style={{ width: '100%' }}>
                        <WorkshopSessionsCard
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                            sessionDates={sessionDates}
                            selectedDaySessions={selectedDaySessions}
                        />
                    </div>

                    {/* Thông báo (Thêm flex: 1 và dãn thẳng xuống đáy) */}
                    <div style={{ marginTop: 16, display: 'flex', flex: 1, width: '100%' }}>
                        {/* Lớp bọc div này sẽ tự động chiếm hết chiều cao còn lại */}
                        <div style={{ flex: 1, width: '100%' }}>
                            <NotificationsCard notifications={notifications} />
                        </div>
                    </div>

                </Col>

            </Row>
        </div>
    );
}