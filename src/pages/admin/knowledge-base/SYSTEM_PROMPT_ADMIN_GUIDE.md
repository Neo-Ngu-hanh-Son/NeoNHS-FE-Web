# Hướng dẫn cập nhật System Prompt động cho AI Chat (Frontend & Backend)

Tài liệu này tóm tắt các thay đổi ở Backend liên quan đến việc chuyển `SYSTEM_PROMPT` của AI Chat từ dạng *hardcode* sang dạng *lưu trữ động* trong cơ sở dữ liệu (MongoDB). Admin có thể dễ dàng cấu hình và thay đổi Prompt từ Front-End.

## 1. Tổng quan thay đổi (Overview)
- **Trước đây:** Prompt mặc định của AI được viết cứng (hardcode) trong file `AiChatServiceImpl.java`. Mỗi lần muốn sửa quy tắc cho AI, cần phải sửa code và deploy lại.
- **Hiện tại:** Prompt được lưu vào collection `knowledge_base` trong MongoDB. Backend sẽ đọc Prompt từ DB mỗi khi AI cần trả lời tin nhắn.

## 2. Cấu trúc Database (MongoDB)

Document `KnowledgeDocument` đã được thêm trường `knowledgeType` để phân biệt giữa **Dữ liệu kiến thức thông thường** và **System Prompt**.

- **Collection:** `knowledge_base`
- **Các trường quan trọng:**
  - `title`: Tên của document (VD: "AI System Prompt").
  - `content`: Nội dung chính của System Prompt (chứa các quy tắc, vai trò của AI).
  - `isActive`: `true` hoặc `false` (Prompt đang được sử dụng hay không).
  - `knowledgeType`: Phân loại dữ liệu.
    - Giá trị `"INFORMATION"`: Bài viết kiến thức, Q&A thông thường cho AI tìm kiếm.
    - Giá trị `"SYSTEM_PROMPT"`: **Dành riêng cho Prompt cấu hình AI**.

## 3. Logic hoạt động của Backend
- Mỗi khi AI khởi tạo ngữ cảnh hội thoại, Backend sẽ query vào collection `knowledge_base` với điều kiện `knowledgeType = "SYSTEM_PROMPT"`.
- Hành vi:
  - **Nếu có dữ liệu:** Backend sẽ lấy `content` của document đầu tiên làm System Prompt.
  - **Nếu chưa có dữ liệu:** Backend sẽ tự động tạo (seed) một document mới với nội dung là `DEFAULT_SYSTEM_PROMPT` và lưu vào DB.
- Hàm Search/Tìm kiếm kiến thức thông thường (`searchByKeyword`) đã được cập nhật để **BỎ QUA** các document có `knowledgeType = "SYSTEM_PROMPT"`, giúp System Prompt không bị lọt vào danh sách kết quả tìm kiếm rác.

---

## 4. Hướng dẫn tích hợp trên Front-End (Admin Panel)

Để Frontend cho Admin có thể chỉnh sửa System Prompt, bạn cần thực hiện các bước sau:

### 4.1. Giao diện (UI)
Bạn có thể thiết kế một màn hình riêng trong Admin Dashboard (VD: **"AI Settings"** hoặc **"Cấu hình AI"**) thay vì trộn lẫn trong tab "Dữ liệu kiến thức (Knowledge Base)".

- **Thành phần UI:**
  - Một `Textarea` hoặc `Markdown Editor` lớn cho phép nhập nội dung `content`.
  - Nút **Lưu/Cập nhật (Save)**.

### 4.2. Khớp nối API (Gợi ý API)
Vì `KnowledgeDocument` sử dụng chung API của thao tác CRUD Knowledge Base, bạn có thể gọi API như sau (tuỳ thuộc vào thiết kế Controller của bạn):

1. **Lấy System Prompt hiện tại (GET):**
   - Gọi API lấy danh sách Knowledge, lọc (filter) theo tham số `knowledgeType=SYSTEM_PROMPT`.
   - Lấy item đầu tiên trong danh sách trả về để hiển thị lên Textarea.
   - *(Hoặc bạn có thể viết thêm 1 API end-point riêng trong Controller chuyên lấy System Prompt nếu muốn tiện hơn).*

2. **Cập nhật System Prompt (PUT/POST):**
   - Khi Admin nhấn **Lưu**, lấy `id` của document System Prompt hiện tại.
   - Gửi request cập nhật nội dung mới (`content`) thông qua API Update Knowledge Document.
   - Payload ví dụ:
     ```json
     {
       "title": "AI System Prompt",
       "content": "Bạn là trợ lý du lịch ảo của NeoNHS...\n- Quy tắc mới: ...",
       "knowledgeType": "SYSTEM_PROMPT",
       "isActive": true
     }
     ```

### 4.3. Lưu ý khi cấu hình
- Nhắc nhở Admin trên UI: **KHÔNG XÓA** thẻ `[TRANSFER_TO_HUMAN]` trong prompt nếu muốn tính năng chuyển sang nhân viên hỗ trợ tiếp tục hoạt động.
- Không nên thay đổi `knowledgeType` của document này sau khi đã tạo để tránh Backend không đọc được.

## Kết luận
Sau khi tích hợp xong màn hình này ở Front-End, Admin chỉ cần nhập yêu cầu/quy tắc mới cho AI, bấm lưu, và tin nhắn tiếp theo của User trên ứng dụng sẽ lập tức áp dụng quy tắc mới mà không cần khởi động lại Backend!
