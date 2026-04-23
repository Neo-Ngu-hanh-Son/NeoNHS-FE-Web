import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Info,
  Link as LinkIcon,
  Calendar,
  User,
  Eye,
  Gavel,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import adminReportService from "@/services/api/adminReportService";
import { AdminReport, ResolveReportRequest } from "@/types/adminReport";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export default function AdminReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<AdminReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [handleNote, setHandleNote] = useState("");

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
      console.error("Failed to fetch report detail:", error);
      message.error("Không thể tải chi tiết báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status: "RESOLVED" | "REJECTED") => {
    if (!handleNote.trim()) {
      message.warning("Vui lòng nhập ghi chú xử lý");
      return;
    }

    setSubmitting(true);
    try {
      const request: ResolveReportRequest = {
        status,
        handleNote: handleNote.trim(),
      };
      await adminReportService.resolveReport(id!, request);
      message.success(
        `Báo cáo đã được ${status === "RESOLVED" ? "chấp nhận" : "từ chối"} thành công`,
      );
      navigate("/admin/reports");
    } catch (error) {
      console.error("Action failed:", error);
      message.error("Cập nhật trạng thái báo cáo thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400";
      case "RESOLVED":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "REJECTED":
        return "bg-rose-100 text-rose-800 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400";
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-10 h-10 animate-spin text-primary" />
          <span className="text-muted-foreground font-medium">Đang tải chi tiết báo cáo...</span>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto p-8 flex flex-col items-center justify-center text-center gap-4 py-32">
        <p className="text-xl text-muted-foreground">Không tìm thấy báo cáo</p>
        <Button variant="outline" onClick={() => navigate("/admin/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 font-display">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumbs / Back */}
        <button
          onClick={() => navigate("/admin/reports")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách kiểm duyệt
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Phân tích báo cáo</h1>
            <p className="text-muted-foreground mt-1">
              Đang xem xét: <span className="font-bold text-primary">{report.targetName}</span>
            </p>
          </div>
          <Badge
            variant="outline"
            className={`px-6 py-2 m-0 rounded-full font-bold uppercase text-xs border-none shadow-sm ${getStatusColor(report.status)}`}
          >
            {report.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Evidence & Description */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                <Eye className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Bằng chứng & Ngữ cảnh
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-xs text-muted-foreground uppercase tracking-widest block mb-2">
                    Lý do báo cáo
                  </span>
                  <h4 className="text-lg font-semibold m-0 text-foreground">{report.reason}</h4>
                </div>

                <div>
                  <span className="font-semibold text-xs text-muted-foreground uppercase tracking-widest block mb-2">
                    Mô tả chi tiết
                  </span>
                  <p className="text-foreground/80 leading-relaxed text-base">
                    {report.description}
                  </p>
                </div>

                {report.evidenceUrl && (
                  <div className="pt-4">
                    <span className="font-semibold text-xs text-muted-foreground uppercase tracking-widest block mb-3">
                      Bằng chứng đính kèm
                    </span>
                    <div className="inline-block rounded-xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-md">
                      <img
                        src={report.evidenceUrl}
                        className="max-w-[300px] object-cover"
                        alt="Bằng chứng báo cáo"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border-2 border-primary/20 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                <Gavel className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Hành động xử lý
                </h2>
              </div>

              <div className="space-y-4">
                <span className="font-semibold text-xs text-muted-foreground uppercase tracking-widest block">
                  Ghi chú xử lý của người kiểm duyệt
                </span>
                <Textarea
                  rows={4}
                  placeholder="Nhập lý do quyết định, ghi chú nội bộ, hoặc tin nhắn cho người báo cáo..."
                  value={handleNote}
                  onChange={(e) => setHandleNote(e.target.value)}
                  className="rounded-xl bg-slate-50 dark:bg-slate-950 text-base resize-none"
                  disabled={report.status !== "PENDING"}
                />

                {report.status === "PENDING" ? (
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button
                      size="lg"
                      className="min-w-[160px] h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                      onClick={() => handleAction("RESOLVED")}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Spinner className="w-4 h-4 mr-2" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                      )}
                      Xử lý & Chấp nhận
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="min-w-[160px] h-12 rounded-xl font-bold"
                      onClick={() => handleAction("REJECTED")}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <Spinner className="w-4 h-4 mr-2" />
                      ) : (
                        <XCircle className="w-5 h-5 mr-2" />
                      )}
                      Từ chối báo cáo
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl text-muted-foreground border border-slate-200 dark:border-slate-800">
                    <Info className="w-5 h-5 text-primary" />
                    <span className="font-medium text-sm">
                      Báo cáo này đã được xử lý và hiện đang ở trạng thái{" "}
                      <strong className="uppercase">{report.status}</strong>.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                <Info className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Thông tin chung
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                    Tài khoản bị báo cáo
                  </span>
                  <div className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
                    <span className="font-semibold text-sm group-hover:text-primary">
                      {report.targetName}
                    </span>
                    <LinkIcon className="w-3 h-3" />
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                    Loại
                  </span>
                  <Badge variant="secondary" className="rounded-full px-3">
                    {report.targetType}
                  </Badge>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                    Người báo cáo
                  </span>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">{report.reporterName}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                    Thời gian
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {dayjs(report.createdAt).format("MMM D, YYYY HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-muted-foreground m-0 italic leading-relaxed">
                * Việc xử lý báo cáo sẽ đánh dấu nội dung để gỡ bỏ ngay lập tức hoặc để đội ngũ an
                toàn xem xét thêm. Người báo cáo sẽ được thông báo về quyết định của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
