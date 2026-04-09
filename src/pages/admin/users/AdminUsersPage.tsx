import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const [searchText, setSearchText] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Dialog states
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
    const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            // Sửa trong hàm fetchUsers
            const params = {
                page: currentPage - 1,
                size: pageSize,
                search: searchText || undefined,
                role: roleFilter === "all" ? undefined : roleFilter,
                isBanned: statusFilter === "all" ? undefined : statusFilter === "BANNED"
            };

            const [usersRes, statsRes] = await Promise.all([
                adminUserService.getAllUsers(params),
                adminUserService.getUserStats()
            ]);

            if (usersRes?.data) {
                setUsers(usersRes.data.content || []);
                setTotal(usersRes.data.totalElements || 0);
            }
            if (statsRes?.data) {
                setStats(statsRes.data);
            }
        } catch (error: any) {
            console.error("AdminUsersPage: fetchUsers Error:", error);
            message.error("Failed to fetch users: " + (error.message || "Unknown error"));
        } finally {
            setIsLoading(false);
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
            message.success("User banned successfully.");
            fetchUsers();
            setIsBanDialogOpen(false);
        } catch (error: any) {
            message.error("Failed to ban user: " + (error.message || "Unknown error"));
            throw error;
        }
    };

    const handleConfirmUnban = async (userId: string) => {
        try {
            await adminUserService.toggleBan(userId);
            message.success("User unbanned successfully.");
            fetchUsers();
            setIsUnbanDialogOpen(false);
        } catch (error: any) {
            message.error("Failed to unban user: " + (error.message || "Unknown error"));
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

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-b from-slate-50 to-white dark:from-white/5 dark:to-transparent p-6 shadow-sm">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                User Management
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Manage system users, their access levels, and account statuses.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1.5">
                                Total users:{" "}
                                <span className="font-black tabular-nums text-slate-900 dark:text-white">{total.toLocaleString()}</span>
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-1.5">
                                Page:{" "}
                                <span className="font-black tabular-nums text-slate-900 dark:text-white">{currentPage}</span>
                                /
                                <span className="font-black tabular-nums text-slate-900 dark:text-white">{Math.max(totalPages, 1)}</span>
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-4 rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active</p>
                            <p className="mt-1 text-2xl font-black tabular-nums text-slate-900 dark:text-white">{displayStats.active}</p>
                        </div>
                        <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-4 rounded-xl border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Banned</p>
                            <p className="mt-1 text-2xl font-black tabular-nums text-slate-900 dark:text-white">{displayStats.banned}</p>
                        </div>
                        <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-4 rounded-xl border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Unverified</p>
                            <p className="mt-1 text-2xl font-black tabular-nums text-slate-900 dark:text-white">{displayStats.unverified}</p>
                        </div>
                        <div className="bg-[#F4F9F6] dark:bg-sidebar-bg/20 p-4 rounded-xl border-l-4 border-slate-500 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Inactive</p>
                            <p className="mt-1 text-2xl font-black tabular-nums text-slate-900 dark:text-white">{displayStats.inactive}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar / Filters */}
            <UserFilter
                searchText={searchText}
                onSearchChange={setSearchText}
                roleFilter={roleFilter}
                onRoleFilterChange={setRoleFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onReset={handleResetFilters}
            />

            {/* Data Table + Pagination */}
            <div className="space-y-4">
                <UserTable users={users} isLoading={isLoading} onToggleBan={handleOpenToggleBan} />

                <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30 rounded-xl overflow-hidden shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing{" "}
                        <span className="font-bold text-slate-900 dark:text-white">
                            {total > 0 ? (currentPage - 1) * pageSize + 1 : 0}
                        </span>{" "}
                        to{" "}
                        <span className="font-bold text-slate-900 dark:text-white">
                            {Math.min(currentPage * pageSize, total)}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-slate-900 dark:text-white">
                            {total.toLocaleString()}
                        </span>{" "}
                        users
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1 || isLoading}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-950 transition-colors disabled:opacity-50 h-9 w-9"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>

                        {getPageItems().map((item, idx) => {
                            if (item === "ellipsis") {
                                return (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 select-none">
                                        ...
                                    </span>
                                );
                            }
                            const pageNum = item;
                            return (
                                <Button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`size-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-none ${currentPage === pageNum
                                        ? "bg-primary text-white hover:bg-primary/90"
                                        : "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-800"
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
                            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-950 transition-colors disabled:opacity-50 h-9 w-9"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
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
