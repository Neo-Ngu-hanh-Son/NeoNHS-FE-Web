import { MoreVertical, UserX, UserCheck } from "lucide-react";
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

    const getStatusBadge = (user: User) => {
        if (user.isBanned) {
            return (
                <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-red-500"></span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        Banned
                    </span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Active
                </span>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="w-full text-left border-collapse">
                    <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 hover:bg-transparent">
                            <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                User Name
                            </TableHead>
                            <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Email Address
                            </TableHead>
                            <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Role
                            </TableHead>
                            <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Status
                            </TableHead>
                            <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    Loading users...
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
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
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="size-10 rounded-full bg-cover bg-center bg-slate-200"
                                                style={{
                                                    backgroundImage: user.avatarUrl
                                                        ? `url("${user.avatarUrl}")`
                                                        : undefined,
                                                }}
                                            >
                                                {!user.avatarUrl && (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                                                        {user.fullname.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white">
                                                {user.fullname}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="p-4">{getRoleBadge(user.role)}</TableCell>
                                    <TableCell className="p-4">{getStatusBadge(user)}</TableCell>
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
