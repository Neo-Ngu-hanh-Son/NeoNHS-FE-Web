import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";
import type { User } from "@/types";

interface UnbanUserDialogProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (userId: string) => Promise<void>;
}

export function UnbanUserDialog({ user, isOpen, onClose, onConfirm }: UnbanUserDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            await onConfirm(user.id);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white dark:bg-[#1a1f1c] border-none shadow-2xl">
                <div className="pt-8 pb-4 flex flex-col items-center">
                    {/* Status Icon */}
                    <div className="bg-[#1f6f43]/10 text-[#1f6f43] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <UserCheck className="size-10 fill-current" />
                    </div>

                    {/* Headline & Body */}
                    <DialogTitle className="text-[#121714] dark:text-white tracking-tight text-2xl font-bold leading-tight px-6 text-center">
                        Unban Account
                    </DialogTitle>
                    <p className="text-[#688274] dark:text-gray-400 text-base font-normal leading-normal pb-6 pt-2 px-8 text-center">
                        This account will regain full system access immediately. All previous restrictions will be lifted.
                    </p>

                    {/* Account Preview Card */}
                    <div className="w-full px-8 mb-6">
                        <div className="p-4 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-[#f6f8f7] dark:bg-white/5 flex items-center gap-4">
                            <div
                                className="size-12 bg-center bg-no-repeat bg-cover rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden"
                                style={{ backgroundImage: user.avatarUrl ? `url("${user.avatarUrl}")` : undefined }}
                            >
                                {!user.avatarUrl && <span className="text-lg font-bold text-slate-400">{user.fullname.charAt(0)}</span>}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-[#121714] dark:text-white text-sm font-bold leading-tight">{user.fullname}</p>
                                <p className="text-[#688274] dark:text-gray-400 text-xs font-normal leading-normal">{user.email}</p>
                                <div className="mt-1">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                        Currently Banned
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex flex-col sm:flex-row w-full gap-3 px-8 pb-8">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 items-center justify-center rounded-lg h-12 bg-[#f1f4f2] dark:bg-white/5 text-[#121714] dark:text-white text-base font-bold leading-normal transition-colors hover:bg-gray-200 dark:hover:bg-white/10 order-2 sm:order-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg h-12 bg-[#1f6f43] hover:bg-[#1f6f43]/90 text-white text-base font-bold leading-normal transition-opacity order-1 sm:order-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Unbanning...</span>
                                </>
                            ) : (
                                <span>Unban Account</span>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
