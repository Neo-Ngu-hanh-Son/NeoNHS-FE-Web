import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { User } from "@/types";

interface UnbanUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => Promise<void>;
}

export function UnbanUserDialog({ user, isOpen, onClose, onConfirm }: UnbanUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) setIsLoading(false);
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await onConfirm(user.id);
      onClose();
    } catch (err) {
      //console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] gap-0 overflow-hidden rounded-2xl border border-slate-100 p-0 dark:border-slate-700 sm:max-w-[480px]">
        <div className="p-6 sm:p-8">
          <DialogHeader className="items-center space-y-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/20">
              <UserCheck className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Gỡ cấm tài khoản
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 dark:text-slate-400">
                Tài khoản sẽ được khôi phục quyền truy cập đầy đủ. Các hạn chế trước đó sẽ được gỡ bỏ.
              </DialogDescription>
            </div>
          </DialogHeader>

          <Card className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 shadow-none dark:border-slate-700 dark:bg-slate-900/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 bg-cover bg-center dark:border-slate-700 dark:bg-slate-800"
                style={{ backgroundImage: user.avatarUrl ? `url("${user.avatarUrl}")` : undefined }}
              >
                {!user.avatarUrl && (
                  <span className="text-lg font-bold text-slate-400">{user.fullname.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user.fullname}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                <span className="mt-2 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-500/20 dark:text-red-400">
                  Đang bị cấm
                </span>
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="mt-8 flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="transition-colors">
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <Spinner className="size-4" />
                  Đang xử lý…
                </>
              ) : (
                "Xác nhận gỡ cấm"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
