# Vendor Dashboard - Backend Data Mapping (No Notifications)

## 1) Muc tieu
Tai lieu nay mo ta du lieu backend can cung cap de map day du voi dashboard vendor hien tai.
Pham vi: chi gom cac khoi dang duoc render tren UI, KHONG bao gom notifications.

## 2) Cac khoi UI can du lieu
- Stats cards: Revenue, Workshops, Bookings, Vouchers (co trend %)
- Revenue overview chart (filter: week, month, year)
- Workshop status pie chart (Active, Pending, Register, Draft)
- Recent transactions table
- Workshop reviews summary
- Workshop sessions calendar + modal list theo ngay

## 3) De xuat endpoint tong hop (khuyen nghi)
### GET /api/vendor/dashboard/overview
Tra ve toan bo du lieu dashboard trong 1 lan goi de giam round-trip.

Query params de xuat:
- revenueRange: week | month | year (default: week)
- timezone: IANA timezone string (vd: Asia/Ho_Chi_Minh)
- from, to (optional ISO date) neu muon custom range

Response de xuat:
```json
{
  "stats": {
    "revenue": { "value": 45280, "currency": "USD", "trendPercent": 12.5, "trendDirection": "up" },
    "workshops": { "value": 28, "trendPercent": 4.2, "trendDirection": "up" },
    "bookings": { "value": 156, "trendPercent": 8.1, "trendDirection": "up" },
    "vouchers": { "value": 42, "trendPercent": 2.3, "trendDirection": "down" }
  },
  "revenueSeries": {
    "range": "week",
    "points": [
      { "label": "Mon", "revenue": 1200 },
      { "label": "Tue", "revenue": 2100 }
    ]
  },
  "workshopStatus": [
    { "name": "Active", "value": 12 },
    { "name": "Pending", "value": 5 },
    { "name": "Register", "value": 8 },
    { "name": "Draft", "value": 3 }
  ],
  "transactions": [
    {
      "id": "TXN-001",
      "workshopName": "Pottery Making",
      "customerName": "John Doe",
      "amount": 150,
      "currency": "USD",
      "paidAt": "2026-03-05T10:00:00Z",
      "status": "completed"
    }
  ],
  "workshopReviews": [
    {
      "workshopId": 1,
      "workshopName": "Pottery Making",
      "totalReviews": 128,
      "averageRating": 4.8,
      "newReviewsInWindow": 12
    }
  ],
  "sessions": {
    "highlightDates": ["2026-03-05", "2026-03-06", "2026-03-10"],
    "byDate": {
      "2026-03-05": [
        {
          "workshopId": 1,
          "workshopName": "Pottery Making",
          "sessionId": 101,
          "startAt": "2026-03-05T09:00:00+07:00",
          "endAt": "2026-03-05T11:00:00+07:00",
          "remainingSlots": 8
        }
      ]
    }
  },
  "meta": {
    "generatedAt": "2026-03-17T09:30:00Z",
    "timezone": "Asia/Ho_Chi_Minh"
  }
}
```

## 4) Mapping chi tiet theo component

### 4.1 DashboardStatsRow
UI dang can:
- Revenue value + trend
- Workshops count + trend
- Bookings count + trend
- Vouchers count + trend

Mapping field:
- stats.revenue.value -> StatCard Revenue value
- stats.revenue.trendPercent + trendDirection -> mui ten + mau
- stats.workshops.value -> StatCard Workshops value
- stats.bookings.value -> StatCard Bookings value
- stats.vouchers.value -> StatCard Vouchers value

Luu y:
- Frontend tu format tien te (co the dua vao currency)
- trendDirection enum: up | down | flat

### 4.2 RevenueOverviewCard
UI dang can:
- Filter: week/month/year
- Danh sach point: label + revenue

Mapping field:
- revenueSeries.range -> selected filter
- revenueSeries.points[].label -> xField (name/label)
- revenueSeries.points[].revenue -> yField

Yeu cau du lieu:
- week: 7 diem (Mon..Sun)
- month: co the theo week bucket hoac day bucket (frontend chap nhan label tu backend)
- year: 12 diem (Jan..Dec)

### 4.3 WorkshopStatusCard
UI dang can pie data:
- Active, Pending, Register, Draft

Mapping field:
- workshopStatus[].name
- workshopStatus[].value

Rang buoc enum name:
- Active | Pending | Register | Draft

### 4.4 TransactionsCard
UI dang can:
- id, workshopName, customerName, amount, status

Mapping field:
- transactions[].id -> Transaction
- transactions[].workshopName -> Workshop
- transactions[].customerName -> Customer
- transactions[].amount -> Amount
- transactions[].status -> Badge variant

Rang buoc status:
- completed | pending | refunded

Khuyen nghi bo sung:
- currency
- paidAt (ISO)
- pagination (page, pageSize, total)

### 4.5 WorkshopReviewsCard
UI dang can:
- workshopName
- totalReviews
- averageRating (0..5)
- so review moi trong ky (de render text "+N this week")

Mapping field:
- workshopReviews[].workshopName
- workshopReviews[].totalReviews
- workshopReviews[].averageRating
- workshopReviews[].newReviewsInWindow

Frontend co the map:
- recent = `+${newReviewsInWindow} this week`

### 4.6 WorkshopSessionsCard (calendar + modal)
UI dang can 2 tap du lieu:
1) Danh sach ngay co session de highlight calendar
2) Danh sach sessions theo ngay de mo modal khi click

Mapping field:
- sessions.highlightDates[] (YYYY-MM-DD)
- sessions.byDate[date][]
  - workshopId
  - workshopName
  - sessionId
  - startAt
  - endAt
  - remainingSlots

Frontend map sang shape hien tai:
- sessionDates = highlightDates.map(date => new Date(date))
- selectedDaySessions = byDate[selectedDate] ->
  - workshopName
  - workshopId
  - time: format `HH:mm - HH:mm` tu startAt/endAt
  - slots: remainingSlots
  - date: new Date(startAt)

## 5) Phuong an endpoint tach rieng (neu khong dung endpoint tong hop)
Neu backend muon tach endpoint, co the dung:
- GET /api/vendor/dashboard/stats
- GET /api/vendor/dashboard/revenue?range=week|month|year
- GET /api/vendor/dashboard/workshop-status
- GET /api/vendor/dashboard/transactions?limit=10
- GET /api/vendor/dashboard/workshop-reviews?limit=10
- GET /api/vendor/dashboard/sessions?from=YYYY-MM-DD&to=YYYY-MM-DD

## 6) Quy uoc du lieu backend nen thong nhat
- Date-time: ISO 8601, uu tien UTC trong transport
- Number: amount/revenue de dang number (khong format string)
- Enum on dinh:
  - revenueRange: week | month | year
  - transactionStatus: completed | pending | refunded
  - workshopStatus: Active | Pending | Register | Draft
- Timezone: backend tra timezone trong `meta.timezone` de frontend format dung

## 7) Validation checklist cho backend
- Co du 4 stats card + trend
- Revenue series doi duoc theo filter week/month/year
- Tong workshop status hop ly (sum khong am)
- Transactions co status hop le
- Reviews co averageRating trong [0, 5]
- Sessions co highlightDates va byDate map dung key ngay

## 8) Ngoai pham vi
- Notifications: chua can implement theo yeu cau hien tai.
