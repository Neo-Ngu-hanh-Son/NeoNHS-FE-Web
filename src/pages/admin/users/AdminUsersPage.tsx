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

            const response = await adminUserService.getAllUsers(params);

            const pageData = response.data;

            if (pageData) {
                setUsers(pageData.content || []);
                setTotal(pageData.totalElements || 0);
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

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title & CTA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        User Management
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage system users, their access levels, and account statuses.
                    </p>
                </div>
                {/* <Button className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all h-auto">
                    <UserPlus className="size-5" />
                    Create User
                </Button> */}
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

            {/* Data Table */}
            <UserTable
                users={users}
                isLoading={isLoading}
                onToggleBan={handleOpenToggleBan}
            />

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

            {/* Pagination Footer */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden shadow-sm">
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
                        className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-900 transition-colors disabled:opacity-50 h-9 w-9"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                            <Button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`size-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-none ${currentPage === pageNum
                                    ? "bg-primary text-white hover:bg-primary/90"
                                    : "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {pageNum}
                            </Button>
                        );
                    })}

                    {totalPages > 5 && <span className="text-slate-400">...</span>}

                    <Button
                        variant="outline"
                        size="icon"
                        disabled={currentPage === totalPages || isLoading || totalPages === 0}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-900 transition-colors disabled:opacity-50 h-9 w-9"
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AdminUsersPage;
