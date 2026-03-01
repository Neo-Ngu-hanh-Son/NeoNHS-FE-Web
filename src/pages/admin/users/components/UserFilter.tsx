import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UserFilterProps {
    searchText: string;
    onSearchChange: (value: string) => void;
    roleFilter: string;
    onRoleFilterChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
    onReset: () => void;
}

export function UserFilter({
    searchText,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    statusFilter,
    onStatusFilterChange,
    onReset,
}: UserFilterProps) {
    return (
        <div className="bg-toolbar-light dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative lg:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                    <Input
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary transition-all"
                        placeholder="Search name or email..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                    <SelectTrigger className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm h-10 px-3 focus:ring-primary focus:border-primary">
                        <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="VENDOR">Vendor</SelectItem>
                        <SelectItem value="TOURIST">Tourist</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm h-10 px-3 focus:ring-primary focus:border-primary">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="BANNED">Banned</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary rounded-lg text-sm font-bold transition-colors h-10 px-4 border-none"
                >
                    <RotateCcw className="size-4" />
                    Reset Filters
                </Button>
            </div>
        </div>
    );
}
