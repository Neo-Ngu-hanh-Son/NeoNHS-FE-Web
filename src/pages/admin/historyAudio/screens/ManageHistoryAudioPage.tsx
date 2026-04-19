import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryAudioPanel } from "@/pages/admin/historyAudio/components";

export default function ManageHistoryAudioPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const pointName = location.state?.pointName;
  if (!id) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Âm thanh lịch sử</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Thiếu mã định danh điểm trong URL.
        </CardContent>
      </Card>
    );
  }

  return <HistoryAudioPanel pointId={id} pointName={pointName} />;
}
