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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { User } from "@/types";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị",
  VENDOR: "Đối tác",
  TOURIST: "Du khách",
};

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

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setError(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!user) return;
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do cấm");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onConfirm(user.id, reason);
      setReason("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể cấm người dùng";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[540px] gap-0 overflow-hidden rounded-2xl border border-slate-200 p-0 dark:border-slate-700 sm:max-w-[540px]">
        <div className="p-6 sm:p-8">
          <DialogHeader className="items-center space-y-4 text-center sm:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/20">
              <ShieldAlert className="h-7 w-7 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Cấm tài khoản
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 dark:text-slate-400">
                Người dùng sẽ mất quyền truy cập ngay lập tức và phiên đăng nhập hiện tại sẽ bị chấm dứt.
              </DialogDescription>
            </div>
          </DialogHeader>

          <Card className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 shadow-none dark:border-slate-700 dark:bg-slate-900/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 bg-cover bg-center dark:border-slate-700 dark:bg-slate-800"
                style={{ backgroundImage: user.avatarUrl ? `url("${user.avatarUrl}")` : undefined }}
              >
                {!user.avatarUrl && (
                  <span className="text-lg font-bold text-slate-400">{user.fullname.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user.fullname}</p>
                  <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-400">
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </div>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-2">
            <Label htmlFor="ban-reason" className="text-sm font-medium text-slate-900 dark:text-white">
              Lý do cấm <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="ban-reason"
              className="min-h-28 resize-none rounded-xl border-slate-200 text-sm transition-colors focus-visible:ring-1 dark:border-slate-700 dark:bg-slate-900"
              placeholder="Mô tả rõ lý do cấm tài khoản (sẽ được lưu trong nhật ký)…"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
            />
            {error ? (
              <p className="flex items-center gap-1 text-xs font-medium text-destructive">
                <AlertCircle className="size-3 shrink-0" />
                {error}
              </p>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                Lý do có thể được hiển thị cho người dùng theo chính sách hệ thống.
              </p>
            )}
          </div>

          <DialogFooter className="mt-8 gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="transition-colors">
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={isLoading}
              className="gap-2 transition-colors"
            >
              {isLoading ? <Spinner className="size-4 text-white" /> : <ShieldAlert className="size-4" />}
              Xác nhận cấm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
