// Date Formatting (Định dạng Ngày)
export const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit', // Đổi sang '2-digit' vì người Việt chuộng định dạng ngày/tháng bằng số (VD: 15/08/2023)
    day: '2-digit'
  })
}

// Date & Time Formatting (Định dạng Ngày & Giờ)
export const formatDateTime = (isoDate: string) => {
  // Lưu ý: Đổi từ toLocaleDateString sang toLocaleString để hiển thị giờ/phút chuẩn xác nhất
  return new Date(isoDate).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Price Formatting (Định dạng Giá tiền)
export const formatPrice = (price: number) => {
  if (price === 0) return "Miễn phí"
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

// Duration Formatting (Định dạng Thời lượng)
export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins} phút`
  if (mins === 0) return `${hours} giờ`
  return `${hours} giờ ${mins} phút` // Bạn có thể đổi thành `${hours}g ${mins}p` nếu muốn viết tắt
}

// Convert duration string to minutes (for backward compatibility)
export const parseDuration = (durationStr: string): number => {
  // Bổ sung thêm 'giờ' và 'g' để nhận diện được cả chuỗi tiếng Việt lẫn tiếng Anh cũ
  const match = durationStr.match(/(\d+)\s*(?:giờ|g|hours?|hrs?|h)/i)
  if (match) {
    return parseInt(match[1]) * 60
  }
  return 0
}