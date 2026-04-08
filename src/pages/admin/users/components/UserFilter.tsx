import { useState, useEffect } from "react";
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
    const [inputValue, setInputValue] = useState(searchText);

    useEffect(() => {
        setInputValue(searchText);
    }, [searchText]);

    const triggerSearch = () => {
        onSearchChange(inputValue);
    };

    const handleReset = () => {
        setInputValue("");
        onReset();
    };

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/30 backdrop-blur p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Filters
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Search and narrow down users quickly.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleReset}
                    className="hidden md:inline-flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary rounded-lg text-sm font-bold transition-colors h-10 px-4 border-none"
                >
                    <RotateCcw className="size-4" />
                    Reset
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative lg:col-span-2 flex items-center">
                    <Input
                        className="w-full pl-4 pr-10 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-primary focus:border-primary transition-all"
                        placeholder="Search name or email... (Press Enter)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
                    />
                    <div
                        className="absolute right-2 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400 hover:text-primary transition-colors"
                        onClick={triggerSearch}
                        title="Click to search"
                    >
                        <Search className="size-4" />
                    </div>
                </div>

                <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                    <SelectTrigger className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm h-10 px-3 focus:ring-primary focus:border-primary">
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
                    <SelectTrigger className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm h-10 px-3 focus:ring-primary focus:border-primary">
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
                    className="md:hidden flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary rounded-lg text-sm font-bold transition-colors h-10 px-4 border-none"
                >
                    <RotateCcw className="size-4" />
                    Reset Filters
                </Button>
            </div>
        </div>
    );
}
