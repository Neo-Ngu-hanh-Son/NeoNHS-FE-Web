import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, ShieldAlert } from "lucide-react";
import type { User } from "@/types";

interface BanUserDialogProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (userId: string, reason: string) => Promise<void>;
}

export function BanUserDialog({ user, isOpen, onClose, onConfirm }: BanUserDialogProps) {
    const [reason, setReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!user) return;
        if (!reason.trim()) {
            setError("Reason is required");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await onConfirm(user.id, reason);
            setReason("");
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to ban user");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden bg-[#F4F9F6] border-none shadow-2xl">
                <div className="flex flex-col p-8">
                    {/* Icon & Header */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="size-16 bg-red-100 dark:bg-red-950/30 text-[#a62b2b] rounded-full flex items-center justify-center mb-4">
                            <ShieldAlert className="size-10 fill-current" />
                        </div>
                        <DialogTitle className="text-[#171212] dark:text-white tracking-tight text-[28px] font-bold leading-tight">
                            Ban Account
                        </DialogTitle>
                        <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-relaxed mt-2 px-6">
                            Are you sure you want to ban this user? They will immediately lose all access to the system and their active sessions will be terminated.
                        </p>
                    </div>

                    {/* User Card Component */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-4 mb-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div
                                className="size-14 bg-center bg-no-repeat bg-cover rounded-lg border border-gray-200 dark:border-zinc-700 bg-slate-100 flex items-center justify-center overflow-hidden"
                                style={{ backgroundImage: user.avatarUrl ? `url("${user.avatarUrl}")` : undefined }}
                            >
                                {!user.avatarUrl && <span className="text-xl font-bold text-slate-400">{user.fullname.charAt(0)}</span>}
                            </div>
                            <div className="flex flex-col flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-[#171212] dark:text-white text-base font-bold leading-tight">{user.fullname}</p>
                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded uppercase tracking-wider">
                                        {user.role}
                                    </span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* TextField Component */}
                    <div className="flex flex-col gap-2 mb-8">
                        <Label className="text-[#171212] dark:text-white text-sm font-semibold leading-normal pb-0">
                            Reason for ban (Required)
                        </Label>
                        <Textarea
                            className={`flex w-full resize-none overflow-hidden rounded-lg text-[#171212] dark:text-white focus-visible:ring-2 focus-visible:ring-[#a62b2b]/20 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-zinc-800'} bg-white dark:bg-zinc-900 focus-visible:border-[#a62b2b] min-h-32 placeholder:text-gray-400 dark:placeholder:text-gray-600 p-4 text-sm font-normal leading-normal shadow-none`}
                            placeholder="Please provide a detailed reason for banning this account..."
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (error) setError(null);
                            }}
                        />
                        {error ? (
                            <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                <AlertCircle className="size-3" />
                                {error}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic">This reason will be logged and may be shared with the user.</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-6 py-6 rounded-lg text-gray-600 dark:text-gray-400 font-bold text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors h-auto"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            className="flex-1 sm:flex-none px-8 py-6 bg-[#a62b2b] hover:bg-[#8e2424] text-white rounded-lg font-bold text-sm shadow-lg shadow-[#a62b2b]/20 transition-all flex items-center justify-center gap-2 h-auto"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <ShieldAlert className="size-4" />
                            )}
                            Ban Account
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
