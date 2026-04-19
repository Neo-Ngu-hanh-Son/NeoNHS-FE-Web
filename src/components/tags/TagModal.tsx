import { message } from "antd";
import { Loader2, Pencil, Tag, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { tagService } from "@/services/api/tagService";
import { workshopTagService } from "@/services/api/workshopTagService";
import type { TagResponse, CreateTagRequest, UpdateTagRequest } from "@/types/tag";
import type { AdminTagKind, AdminTagModalMode } from "@/hooks/tag/useAdminTags";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import TagFormContent from "./tagModal/TagFormContent";
import TagConfirmationContent from "./tagModal/TagConfirmationContent";
import { INITIAL_TAG_FORM } from "./tagModal/constants";
import { isValidUrl, toFormValues } from "./tagModal/utils";
import type { TagFormErrors, TagFormValues } from "./tagModal/types";

interface TagModalProps {
  kind: AdminTagKind;
  mode: AdminTagModalMode;
  tag: TagResponse | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function TagModal({ kind, mode, tag, onCancel, onSuccess }: TagModalProps) {
  const [formValues, setFormValues] = useState<TagFormValues>(INITIAL_TAG_FORM);
  const [formErrors, setFormErrors] = useState<TagFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const isOpen = mode !== null;
  const isDelete = mode === "delete";
  const isRestore = mode === "restore";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const title = useMemo(() => {
    if (mode === "create") return kind === "event" ? "Thêm nhãn sự kiện" : "Thêm nhãn workshop";
    if (mode === "edit") return kind === "event" ? "Sửa nhãn sự kiện" : "Sửa nhãn workshop";
    if (mode === "delete") return "Xóa nhãn";
    if (mode === "restore") return "Khôi phục nhãn";
    return "";
  }, [kind, mode]);

  const subtitle = useMemo(() => {
    if (mode === "create") return "Điền thông tin để tạo nhãn mới.";
    if (mode === "edit") return "Cập nhật các trường bạn muốn thay đổi.";
    if (mode === "delete") {
      return kind === "event"
        ? "Nhãn sẽ bị vô hiệu hóa và có thể khôi phục sau."
        : "Thao tác này xóa vĩnh viễn nhãn workshop và không thể hoàn tác.";
    }
    if (mode === "restore") return "Nhãn sẽ được kích hoạt lại ngay.";
    return "";
  }, [kind, mode]);

  useEffect(() => {
    if (!isOpen) {
      setFormValues(INITIAL_TAG_FORM);
      setFormErrors({});
      setSubmitting(false);
      return;
    }

    if (isEdit && tag) {
      setFormValues(toFormValues(tag));
      setFormErrors({});
    }

    if (isCreate) {
      setFormValues(INITIAL_TAG_FORM);
      setFormErrors({});
    }
  }, [isCreate, isEdit, isOpen, tag]);

  const handleFieldChange = useCallback((field: keyof TagFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const errors: TagFormErrors = {};
    const trimmedName = formValues.name.trim();

    if (isCreate && !trimmedName) {
      errors.name = "Tên nhãn là bắt buộc";
    }

    if (isEdit && tag && formValues.name !== (tag.name ?? "") && !trimmedName) {
      errors.name = "Nếu nhập tên thì không được để trống";
    }

    if (kind === "workshop") {
      if (trimmedName.length > 100) {
        errors.name = "Tên nhãn không được vượt quá 100 ký tự";
      }
      if (formValues.description.length > 255) {
        errors.description = "Mô tả không được vượt quá 255 ký tự";
      }
      if (formValues.tagColor.length > 20) {
        errors.tagColor = "Mã màu không được vượt quá 20 ký tự";
      }
    }

    if (formValues.iconUrl && !isValidUrl(formValues.iconUrl)) {
      errors.iconUrl = "URL biểu tượng không hợp lệ";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues, isCreate, isEdit, kind, tag]);

  const buildCreatePayload = (): CreateTagRequest => {
    return {
      name: formValues.name.trim(),
      description: formValues.description.trim() || undefined,
      tagColor: formValues.tagColor.trim() || undefined,
      iconUrl: formValues.iconUrl.trim() || undefined,
    };
  };

  const buildUpdatePayload = (): UpdateTagRequest => {
    if (!tag) return {};

    const payload: UpdateTagRequest = {};

    if (formValues.name !== (tag.name ?? "")) {
      payload.name = formValues.name.trim();
    }
    if (formValues.description !== (tag.description ?? "")) {
      payload.description = formValues.description;
    }
    if (formValues.tagColor !== (tag.tagColor ?? "")) {
      payload.tagColor = formValues.tagColor;
    }
    if (formValues.iconUrl !== (tag.iconUrl ?? "")) {
      payload.iconUrl = formValues.iconUrl.trim();
    }

    return payload;
  };

  const handleCreateOrEdit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      if (isCreate) {
        const payload = buildCreatePayload();

        if (kind === "event") {
          await tagService.createTag(payload);
        } else {
          await workshopTagService.createWorkshopTag(payload);
        }

        message.success(kind === "event" ? "Đã tạo nhãn sự kiện." : "Đã tạo nhãn workshop.");
        onSuccess();
        return;
      }

      if (isEdit && tag) {
        const payload = buildUpdatePayload();
        if (Object.keys(payload).length === 0) {
          message.info("Không có thay đổi nào.");
          onCancel();
          return;
        }

        if (kind === "event") {
          await tagService.updateTag(tag.id, payload);
        } else {
          await workshopTagService.updateWorkshopTag(tag.id, payload);
        }

        message.success(kind === "event" ? "Đã cập nhật nhãn sự kiện." : "Đã cập nhật nhãn workshop.");
        onSuccess();
      }
    } catch (error: unknown) {
      message.error(
        getApiErrorMessage(
          error,
          isCreate
            ? "Không tạo được nhãn. Vui lòng thử lại."
            : "Không cập nhật được nhãn. Vui lòng thử lại.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!tag) return;

    try {
      setSubmitting(true);
      if (kind === "event") {
        await tagService.deleteTag(tag.id);
      } else {
        await workshopTagService.deleteWorkshopTag(tag.id);
      }
      message.success(
        kind === "event" ? "Đã xóa nhãn sự kiện." : "Đã xóa nhãn workshop.",
      );
      onSuccess();
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, "Không xóa được nhãn. Vui lòng thử lại."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestore = async () => {
    if (!tag) return;

    try {
      setSubmitting(true);
      await tagService.restoreTag(tag.id);
      message.success("Đã khôi phục nhãn.");
      onSuccess();
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, "Không khôi phục được nhãn. Vui lòng thử lại."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-lg border-border rounded-2xl px-6 py-5">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
              {isDelete || isRestore ? (
                <TriangleAlert className="h-4 w-4 text-destructive" />
              ) : isEdit ? (
                <Pencil className="h-4 w-4 text-primary" />
              ) : (
                <Tag className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-gray-900 leading-tight">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">{subtitle}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isDelete || isRestore ? (
          tag ? (
            <TagConfirmationContent
              kind={kind}
              mode={isRestore ? "restore" : "delete"}
              subtitle={subtitle}
              tag={tag}
            />
          ) : null
        ) : (
          <TagFormContent
            kind={kind}
            isCreate={isCreate}
            values={formValues}
            errors={formErrors}
            onFieldChange={handleFieldChange}
            onNameBlur={() => {
              if (!formValues.name.trim()) {
                setFormErrors((prev) => ({ ...prev, name: "Tên nhãn là bắt buộc" }));
              }
            }}
          />
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            Hủy
          </Button>

          {isDelete && (
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Xóa
            </Button>
          )}

          {isRestore && (
            <Button onClick={handleRestore} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Khôi phục
            </Button>
          )}

          {(isCreate || isEdit) && (
            <Button onClick={handleCreateOrEdit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isCreate ? "Tạo nhãn" : "Lưu thay đổi"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TagModal;
