import { Row, Col } from 'antd';
import {
    DashboardStatsRow,
    NotificationsCard,
    RevenueOverviewCard,
    TransactionsCard,
    WorkshopReviewsCard,
    WorkshopSessionsCard,
    WorkshopStatusCard,
} from './components';
import { notifications } from './data';
import { useVendorDashboard } from '@/hooks/vendor/useVendorDashboard';

export default function VendorDashboardPage() {
    const {
        loading,
        stats,
        revenueFilter,
        setRevenueFilter,
        revenueData,
        workshopStatus,
        transactions,
        reviews,
        selectedDate,
        setSelectedDate,
        sessionDates,
        selectedDaySessions,
    } = useVendorDashboard();

    if (loading) {
        return (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading ...</p>
            </div>
          </div>
        );
      }

    return (
        <div className="p-4">
            <Row gutter={[16, 16]} align="stretch">

                <Col xs={24} xl={16} style={{ display: 'flex', flexDirection: 'column' }}>

                    <Row gutter={[16, 16]}>
                        <DashboardStatsRow stats={stats} />
                    </Row>

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
                                <WorkshopStatusCard data={workshopStatus} />
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: 16, flex: 1 }}>
                        <Col xs={24} lg={15} style={{ display: 'flex' }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <TransactionsCard transactions={transactions} />
                            </div>
                        </Col>
                        <Col xs={24} lg={9} style={{ display: 'flex' }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <WorkshopReviewsCard reviews={reviews} />
                            </div>
                        </Col>
                    </Row>

                </Col>

                <Col xs={24} xl={8} style={{ display: 'flex', flexDirection: 'column' }}>

                    <div style={{ width: '100%' }}>
                        <WorkshopSessionsCard
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                            sessionDates={sessionDates}
                            selectedDaySessions={selectedDaySessions}
                        />
                    </div>

                    <div style={{ marginTop: 16, display: 'flex', flex: 1, width: '100%' }}>
                        <div style={{ flex: 1, width: '100%' }}>
                            <NotificationsCard notifications={notifications} />
                        </div>
                    </div>

                </Col>

            </Row>
        </div>
    );
}