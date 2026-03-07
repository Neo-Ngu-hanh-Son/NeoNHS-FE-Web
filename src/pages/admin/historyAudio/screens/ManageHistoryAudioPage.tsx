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
          <CardTitle>History Audio</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Missing point identifier in URL.
        </CardContent>
      </Card>
    );
  }

  return <HistoryAudioPanel pointId={id} pointName={pointName} />;
}
