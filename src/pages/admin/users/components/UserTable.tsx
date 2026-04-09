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
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types";

interface UserTableProps {
    users: User[];
    onToggleBan: (user: User) => void;
    isLoading: boolean;
}

export function UserTable({ users, onToggleBan, isLoading }: UserTableProps) {
    const getRoleBadge = (role: string) => {
        switch (role) {
            case "ADMIN":
                return (
                    <Badge className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border border-primary/20 bg-primary/10 text-primary shadow-none">
                        Admin
                    </Badge>
                );
            case "VENDOR":
                return (
                    <Badge
                        variant="outline"
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 shadow-none"
                    >
                        Vendor
                    </Badge>
                );
            case "TOURIST":
                return (
                    <Badge
                        variant="outline"
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 shadow-none"
                    >
                        Tourist
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{role}</Badge>;
        }
    };

    const getAccountStatus = (user: User) => {
        if (user.isBanned) {
            return (
                <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-500" />
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">Banned</span>
                </div>
            );
        }
        if (!user.isActive) {
            return (
                <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500" />
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Inactive</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-500" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">Active</span>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-950/30 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="w-full text-left border-collapse">
                    <TableHeader>
                        <TableRow className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
                            <TableHead className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                User
                            </TableHead>
                            <TableHead className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Role
                            </TableHead>
                            <TableHead className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Verification
                            </TableHead>
                            <TableHead className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Account
                            </TableHead>
                            <TableHead className="p-4 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-slate-500 dark:text-slate-400">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-slate-500 dark:text-slate-400">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="hover:bg-primary/5 transition-colors border-none"
                                >
                                    <TableCell className="p-4">
                                        <div className="flex items-center gap-3 min-w-[260px]">
                                            <div
                                                className="size-11 rounded-2xl bg-cover bg-center bg-slate-200 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden"
                                                style={{
                                                    backgroundImage: user.avatarUrl
                                                        ? `url("${user.avatarUrl}")`
                                                        : undefined,
                                                }}
                                            >
                                                {!user.avatarUrl && (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-300 font-black text-sm">
                                                        {user.fullname.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
                                                    {user.fullname}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-4">{getRoleBadge(user.role)}</TableCell>
                                    <TableCell className="p-4">
                                        {user.isVerified ? (
                                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-300">
                                                <CheckCircle2 className="size-4" />
                                                <span className="text-xs font-bold">Verified</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-slate-700 dark:text-slate-300">
                                                <XCircle className="size-4" />
                                                <span className="text-xs font-bold">Unverified</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="p-4">{getAccountStatus(user)}</TableCell>
                                    <TableCell className="p-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => onToggleBan(user)}
                                                    className={user.isBanned ? "text-green-600" : "text-red-600"}
                                                >
                                                    {user.isBanned ? (
                                                        <>
                                                            <UserCheck className="mr-2 h-4 w-4" />
                                                            <span>Unban User</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserX className="mr-2 h-4 w-4" />
                                                            <span>Ban User</span>
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                {!user.isBanned && !user.isActive && (
                                                    <DropdownMenuItem className="text-amber-700">
                                                        <CircleSlash className="mr-2 h-4 w-4" />
                                                        <span>Inactive</span>
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
        </div>
    );
}
