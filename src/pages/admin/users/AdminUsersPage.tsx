import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Users, UserX, MailWarning, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserFilter } from "./components/UserFilter";
import { UserTable } from "./components/UserTable";
import { adminUserService } from "@/services/api/adminUserService";
import type { User } from "@/types";
import { message } from "antd";
import { BanUserDialog } from "./components/BanUserDialog";
import { UnbanUserDialog } from "./components/UnbanUserDialog";

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<{
    active?: number;
    banned?: number;
    unverified?: number;
    inactive?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
  /** Sau lần tải đầu tiên (danh sách + thống kê), chỉ bảng hiển thị trạng thái loading khi lọc/đổi trang */
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: pageSize,
        search: searchText || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        isBanned: statusFilter === "all" ? undefined : statusFilter === "BANNED",
      };

      const [usersRes, statsRes] = await Promise.all([
        adminUserService.getAllUsers(params),
        adminUserService.getUserStats(),
      ]);

      if (usersRes?.data) {
        setUsers(usersRes.data.content || []);
        setTotal(usersRes.data.totalElements || 0);
      }
      if (statsRes?.data) {
        setStats(statsRes.data);
      }
    } catch (error: unknown) {
      //console.error("AdminUsersPage: fetchUsers Error:", error);
      const msg = error instanceof Error ? error.message : "Lỗi không xác định";
      message.error("Không thể tải danh sách người dùng: " + msg);
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  }, [currentPage, pageSize, searchText, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenToggleBan = (user: User) => {
    setSelectedUser(user);
    if (user.isBanned) {
      setIsUnbanDialogOpen(true);
    } else {
      setIsBanDialogOpen(true);
    }
  };

  const handleConfirmBan = async (userId: string, reason: string) => {
    try {
      await adminUserService.toggleBan(userId, reason);
      message.success("Đã cấm tài khoản.");
      fetchUsers();
      setIsBanDialogOpen(false);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Lỗi không xác định";
      message.error("Không thể cấm người dùng: " + msg);
      throw error;
    }
  };

  const handleConfirmUnban = async (userId: string) => {
    try {
      await adminUserService.toggleBan(userId);
      message.success("Đã gỡ cấm tài khoản.");
      fetchUsers();
      setIsUnbanDialogOpen(false);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Lỗi không xác định";
      message.error("Không thể gỡ cấm: " + msg);
      throw error;
    }
  };

  const handleResetFilters = () => {
    setSearchText("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  const displayStats = {
    active: stats?.active ?? 0,
    banned: stats?.banned ?? 0,
    unverified: stats?.unverified ?? 0,
    inactive: stats?.inactive ?? 0,
  };

  const getPageItems = () => {
    if (totalPages <= 1) return [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const items: Array<number | "ellipsis"> = [1];
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    if (left > 2) items.push("ellipsis");
    for (let i = left; i <= right; i++) items.push(i);
    if (right < totalPages - 1) items.push("ellipsis");

    items.push(totalPages);
    return items;
  };

  const statCards = [
    {
      label: "Đang hoạt động",
      value: displayStats.active,
      icon: Users,
      iconWrap: "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Đã cấm",
      value: displayStats.banned,
      icon: UserX,
      iconWrap: "bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400",
    },
    {
      label: "Chưa xác thực",
      value: displayStats.unverified,
      icon: MailWarning,
      iconWrap: "bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Không hoạt động",
      value: displayStats.inactive,
      icon: UserMinus,
      iconWrap: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400",
    },
  ] as const;

  if (isLoading && !initialLoadComplete) {
    return (
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="flex min-h-[50vh] items-center justify-center p-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            <p className="text-muted-foreground">Đang tải trang quản lý người dùng…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm dark:border-white/10 dark:from-white/5 dark:to-transparent">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Quản lý người dùng
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Xem, lọc và quản lý quyền truy cập, trạng thái tài khoản trong hệ thống.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
                Tổng:{" "}
                <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                  {total.toLocaleString("vi-VN")}
                </span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
                Trang{" "}
                <span className="font-bold tabular-nums text-slate-900 dark:text-white">{currentPage}</span>/
                <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                  {Math.max(totalPages, 1)}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {statCards.map(({ label, value, icon: Icon, iconWrap }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div
                  className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${iconWrap}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {label}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                  {value.toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UserFilter
        searchText={searchText}
        onSearchChange={setSearchText}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onReset={handleResetFilters}
      />

      <div className="space-y-4">
        <UserTable users={users} isLoading={isLoading} onToggleBan={handleOpenToggleBan} />

        <div className="flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-700 dark:bg-slate-900/40 md:flex-row md:items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hiển thị{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {total > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{" "}
            –{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {Math.min(currentPage * pageSize, total)}
            </span>{" "}
            trong tổng{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{total.toLocaleString("vi-VN")}</span>{" "}
            người dùng
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-9 w-9 shrink-0 rounded-xl border-slate-200 transition-colors hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="size-4" />
            </Button>

            {getPageItems().map((item, idx) => {
              if (item === "ellipsis") {
                return (
                  <span key={`ellipsis-${idx}`} className="select-none px-2 text-slate-400">
                    …
                  </span>
                );
              }
              const pageNum = item;
              return (
                <Button
                  key={pageNum}
                  type="button"
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-9 w-9 rounded-xl text-sm font-semibold transition-colors ${
                    currentPage === pageNum
                      ? ""
                      : "border-slate-200 bg-transparent text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages || isLoading || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-9 w-9 shrink-0 rounded-xl border-slate-200 transition-colors hover:bg-white dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <BanUserDialog
        user={selectedUser}
        isOpen={isBanDialogOpen}
        onClose={() => setIsBanDialogOpen(false)}
        onConfirm={handleConfirmBan}
      />
      <UnbanUserDialog
        user={selectedUser}
        isOpen={isUnbanDialogOpen}
        onClose={() => setIsUnbanDialogOpen(false)}
        onConfirm={handleConfirmUnban}
      />
    </div>
  );
}

export default AdminUsersPage;
