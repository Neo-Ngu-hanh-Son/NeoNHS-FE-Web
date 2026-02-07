import { Button, Input, Card } from 'antd';
import { QrcodeOutlined, ScanOutlined, CheckCircleOutlined } from '@ant-design/icons';

export default function TicketVerificationPage() {
    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Ticket Verification</h1>
                <p className="text-[#588d70]">Scan QR codes or enter manual codes to verify guest tickets</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card
                    title={<span className="flex items-center gap-2"><ScanOutlined /> Manual Code Entry</span>}
                    className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm"
                >
                    <p className="text-gray-500 mb-6">Enter the 12-digit ticket code provided by the customer.</p>
                    <div className="flex flex-col gap-4">
                        <Input
                            size="large"
                            placeholder="e.g. TKT-1234-5678"
                            className="font-mono text-center tracking-widest h-14 text-xl"
                        />
                        <Button
                            type="primary"
                            size="large"
                            className="bg-primary border-0 h-14 font-bold text-lg"
                            block
                        >
                            Verify Ticket
                        </Button>
                    </div>
                </Card>

                <Card
                    title={<span className="flex items-center gap-2"><QrcodeOutlined /> QR Code Scanner</span>}
                    className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm text-center"
                >
                    <div className="flex flex-col items-center justify-center min-h-[250px] bg-background-light dark:bg-white/5 rounded-xl border-2 border-dashed border-primary/20">
                        <QrcodeOutlined className="text-6xl text-primary/30 mb-4 animate-pulse" />
                        <p className="text-gray-500 max-w-[200px]">Allow camera access to scan ticket QR codes instantly.</p>
                        <Button
                            icon={<ScanOutlined />}
                            className="mt-6 border-primary text-primary h-11 px-8"
                        >
                            Activate Scanner
                        </Button>
                    </div>
                </Card>
            </div>

            <Card className="rounded-2xl border-[#d3e4da] dark:border-white/10 shadow-sm mt-4">
                <div className="flex items-center gap-4 text-gray-400">
                    <CheckCircleOutlined className="text-2xl" />
                    <div>
                        <p className="font-medium text-gray-600 dark:text-gray-300">Verification History</p>
                        <p className="text-sm">Last verified: No recent activity</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
