import { CheckCircle2, CircleSlash, MoreVertical, UserCheck, UserX, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { User } from "@/types";

interface UserTableProps {
  users: User[];
  onToggleBan: (user: User) => void;
  isLoading: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị",
  VENDOR: "Nhà cung cấp",
  TOURIST: "Du khách",
};

function roleBadgeClasses(role: string): string {
  switch (role) {
    case "ADMIN":
      return "text-xs bg-violet-100 px-3 py-1.5 font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-400 rounded-full";
    case "VENDOR":
      return "text-xs bg-blue-50 px-3 py-1.5 font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 rounded-full";
    case "TOURIST":
      return "text-xs bg-slate-100 px-3 py-1.5 font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-full";
    default:
      return "text-xs rounded-full bg-secondary px-3 py-1.5 font-medium";
  }
}

export function UserTable({ users, onToggleBan, isLoading }: UserTableProps) {
  const getRoleBadge = (role: string) => (
    <span className={roleBadgeClasses(role)}>{ROLE_LABELS[role] ?? role}</span>
  );

  const getAccountStatus = (user: User) => {
    if (user.isBanned) {
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700 dark:text-red-400">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
          Đã cấm
        </span>
      );
    }
    if (!user.isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-400">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
          Không hoạt động
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
        Đang hoạt động
      </span>
    );
  };

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50/90 hover:bg-transparent dark:border-slate-700 dark:bg-slate-900/50">
              <TableHead className="p-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Người dùng
              </TableHead>
              <TableHead className="p-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Vai trò
              </TableHead>
              <TableHead className="p-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Xác thực
              </TableHead>
              <TableHead className="p-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Tài khoản
              </TableHead>
              <TableHead className="p-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16">
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Spinner className="h-8 w-8 text-primary" />
                    <p className="text-sm">Đang tải danh sách…</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <div className="rounded-xl border-2 border-dashed border-slate-200 py-10 text-center dark:border-slate-700">
                    <UserX className="mx-auto mb-3 h-10 w-10 text-slate-300 dark:text-slate-600" />
                    <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">
                      Không có người dùng
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Thử đổi bộ lọc hoặc từ khóa tìm kiếm.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-slate-800 dark:hover:bg-slate-900/40"
                >
                  <TableCell className="p-4">
                    <div className="flex min-w-[240px] items-center gap-3">
                      <div
                        className="size-11 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 bg-cover bg-center dark:border-slate-700 dark:bg-slate-800"
                        style={{
                          backgroundImage: user.avatarUrl ? `url("${user.avatarUrl}")` : undefined,
                        }}
                      >
                        {!user.avatarUrl && (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400">
                            {user.fullname.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex flex-col">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {user.fullname}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="p-4">
                    {user.isVerified ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span className="text-xs font-medium">Đã xác thực</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        <XCircle className="size-4 shrink-0" />
                        <span className="text-xs font-medium">Chưa xác thực</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="p-4">{getAccountStatus(user)}</TableCell>
                  <TableCell className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[10rem]">
                        <DropdownMenuItem
                          onClick={() => onToggleBan(user)}
                          className={
                            user.isBanned
                              ? "text-emerald-700 focus:text-emerald-700 dark:text-emerald-400"
                              : "text-destructive focus:text-destructive"
                          }
                        >
                          {user.isBanned ? (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Gỡ cấm
                            </>
                          ) : (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Cấm tài khoản
                            </>
                          )}
                        </DropdownMenuItem>
                        {!user.isBanned && !user.isActive && (
                          <DropdownMenuItem disabled className="text-amber-700 opacity-70">
                            <CircleSlash className="mr-2 h-4 w-4" />
                            Không hoạt động
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
