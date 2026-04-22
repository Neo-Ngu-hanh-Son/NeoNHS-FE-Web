import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import adminReportService from "@/services/api/adminReportService";
import {
  AdminReport,
  ReportFilter,
  ReportStatus,
  ReportTargetType,
  SpringPage,
} from "@/types/adminReport";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Filter,
  Search,
  BarChart3,
  MapPin,
  Calendar,
  PartyPopper,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(9);

  // Filters from URL
  const statusFilter = (searchParams.get("status") as ReportStatus) || "ALL";
  const typeFilter = (searchParams.get("targetType") as ReportTargetType) || "ALL";
  const searchTerm = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const triggerSearch = () => {
    handleFilterChange("q", inputValue);
  };

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
        status: statusFilter === ("ALL" as any) ? undefined : statusFilter,
        targetType: typeFilter === "ALL" ? undefined : typeFilter,
        reporterName: searchTerm || undefined,
        page: page - 1,
        size: pageSize,
      };
      const response: SpringPage<AdminReport> = await adminReportService.getReports(filter);
      setReports(response.content || []);
      setTotal(response.totalElements || 0);
    } catch (error: any) {
      setReports([]);
      setTotal(0);

      // Mute the 404/400 errors visually for search not found, only log them
      const status = error?.response?.status;
      if (!status || status >= 500) {
        console.error("Failed to fetch reports:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "ALL") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const getStatusColor = (status: ReportStatus) => {
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

  const getStatusLabel = (status: ReportStatus) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "RESOLVED":
        return "Đã giải quyết";
      case "REJECTED":
        return "Bị từ chối";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen font-display text-[#121715] dark:text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Trung tâm báo cáo</h2>
              <p className="text-muted-foreground text-sm">
                Xem xét và kiểm duyệt các báo cáo hệ thống ({total})
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-[#1a2b24] p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative w-full lg:max-w-md flex items-center">
            <Input
              placeholder="Tìm theo tên người báo cáo... (Enter để tìm)"
              className="w-full pl-4 pr-12 h-10 rounded-xl text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
            />
            <button
              className="absolute right-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer text-slate-500 transition-colors flex items-center"
              onClick={triggerSearch}
              title="Nhấn để tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <Select
              value={typeFilter}
              onValueChange={(val) => handleFilterChange("targetType", val)}
            >
              <SelectTrigger className="w-[160px] h-10 rounded-xl">
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                <SelectItem value="POINT">Điểm</SelectItem>
                <SelectItem value="EVENT">Sự kiện</SelectItem>
                <SelectItem value="WORKSHOP">Workshop</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(val) => handleFilterChange("status", val)}>
              <SelectTrigger className="w-[160px] h-10 rounded-xl">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="RESOLVED">Đã giải quyết</SelectItem>
                <SelectItem value="REJECTED">Bị từ chối</SelectItem>
              </SelectContent>
            </Select>

            <Button className="h-10 px-6 rounded-xl font-semibold shadow-md" onClick={fetchReports}>
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Reports Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
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
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col gap-5 group relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
                      {report.targetType === "WORKSHOP" ? (
                        <PartyPopper className="w-7 h-7" />
                      ) : report.targetType === "EVENT" ? (
                        <Calendar className="w-7 h-7" />
                      ) : (
                        <MapPin className="w-7 h-7" />
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 m-0 rounded-full font-bold uppercase text-[10px] border-none ${getStatusColor(report.status)}`}
                    >
                      {getStatusLabel(report.status)}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {report.targetType}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs font-medium text-muted-foreground truncate max-w-[150px]">
                        {report.targetName}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
                      {report.reason}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                      {report.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="text-xs font-medium">{report.reporterName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium">
                          {dayjs(report.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>
                    <Button
                      className="h-10 px-5 rounded-lg transition-all font-bold text-sm"
                      onClick={() => navigate(`/admin/reports/${report.id}`)}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-20 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">
                Không tìm thấy báo cáo nào phù hợp với bộ lọc.
              </p>
            </div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex justify-center pt-8 gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center justify-center px-4 font-medium text-sm">
              Trang {page} / {Math.ceil(total / pageSize)}
            </div>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Footer Stats */}
        <footer className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-6 opacity-80">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
              Tổng báo cáo
            </p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
              Chờ xử lý
            </p>
            <p className="text-2xl font-bold text-amber-600">
              {reports.filter((r) => r.status === "PENDING").length}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
              Đã giải quyết
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {reports.filter((r) => r.status === "RESOLVED").length}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
              Bị từ chối
            </p>
            <p className="text-2xl font-bold text-rose-600">
              {reports.filter((r) => r.status === "REJECTED").length}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
