# Workshop Sessions Data Update Summary

## 📊 Changes Made

### 1. **Expanded Session Count**
- **Before**: 7 sessions
- **After**: 15 sessions
- **Distribution**:
  - 12 SCHEDULED sessions
  - 2 COMPLETED sessions (past)
  - 1 CANCELLED session

### 2. **Currency Updated to VND**
All prices converted from USD to Vietnamese Dong (VND):
- Pottery Workshop: 750,000 - 800,000 VND (Premium evening: 800k)
- Yoga/Meditation: 450,000 VND

**Formatters**: Already configured for VND display (e.g., `750.000 ₫`)

### 3. **Time Range Standardized: 6 AM - 8 PM**
All session start times now fall within 6:00 AM to 8:00 PM range:

#### Session Schedule:
| Date | Time | Workshop | Status | Enrollments |
|------|------|----------|--------|-------------|
| **Feb 5** | 10:00 - 13:00 | Pottery | COMPLETED | 10/12 |
| **Feb 8** | 07:00 - 09:00 | Yoga | COMPLETED | 15/20 |
| **Feb 13** | 06:30 - 09:30 | Pottery | SCHEDULED | 8/12 |
| **Feb 13** | 10:00 - 12:00 | Yoga | SCHEDULED | 15/20 |
| **Feb 13** | 14:00 - 17:00 | Pottery | SCHEDULED (FULL) | 12/12 |
| **Feb 14** | 07:00 - 09:00 | Yoga | SCHEDULED | 10/20 |
| **Feb 15** | 13:30 - 16:30 | Pottery | SCHEDULED | 3/12 |
| **Feb 16** | 06:00 - 08:00 | Yoga | SCHEDULED | 18/20 |
| **Feb 17** | 09:30 - 12:30 | Pottery | SCHEDULED | 5/12 |
| **Feb 18** | 17:00 - 19:00 | Yoga | SCHEDULED | 12/20 |
| **Feb 19** | 17:00 - 20:00 | Pottery | SCHEDULED | 6/10 |
| **Feb 20** | 11:00 - 13:00 | Yoga | SCHEDULED | 7/20 |
| **Feb 21** | 08:00 - 11:00 | Pottery | SCHEDULED | 4/12 |
| **Feb 22** | 15:00 - 17:00 | Yoga | SCHEDULED | 16/20 |
| **Feb 25** | 14:00 - 17:00 | Pottery | CANCELLED | 3/12 |

### 4. **Diverse Time Slots**
Sessions spread across different times of day:
- **Early Morning** (6:00 - 8:00 AM): 2 sessions
- **Morning** (8:00 - 11:00 AM): 4 sessions
- **Midday** (11:00 - 14:00 PM): 2 sessions
- **Afternoon** (14:00 - 17:00 PM): 4 sessions
- **Evening** (17:00 - 20:00 PM): 3 sessions

### 5. **Realistic Enrollment Distribution**
- **Fully Booked**: 1 session (Feb 13 evening)
- **Nearly Full** (>75%): 3 sessions
- **Half Full** (40-75%): 5 sessions
- **Low Enrollment** (<40%): 3 sessions
- **Past/Cancelled**: 3 sessions

---

## 🎯 Benefits for Testing

### Calendar View Testing
1. **Month View**: More sessions visible across February
2. **Week View**: Multiple time slots populated throughout each day
3. **Day View**: Better visualization of daily schedules

### Time Distribution
- **6 AM slots**: Test earliest time handling
- **8 PM slots**: Test latest time handling
- **Multiple sessions per day**: Feb 13 has 3 sessions!
- **Various durations**: 2-hour (Yoga) and 3-hour (Pottery) workshops

### Price Display
- **VND formatting**: Test thousand separators (e.g., 750.000 ₫)
- **Different price points**: 450k, 750k, 800k VND
- **Premium pricing**: Evening sessions may have higher rates

---

## 📅 Highlighted Test Dates

### **Feb 13 (Thursday)** - BUSY DAY!
- 06:30 AM: Pottery (8/12)
- 10:00 AM: Yoga (15/20)
- 02:00 PM: Pottery **FULLY BOOKED** (12/12)

### **Feb 16 (Sunday)** - EARLY MORNING
- 06:00 AM: Yoga - Earliest session (18/20)

### **Feb 19 (Wednesday)** - LATE EVENING
- 05:00 PM - 08:00 PM: Pottery - Latest ending time (6/10)

### **Feb 22 (Saturday)** - AFTERNOON
- 03:00 PM: Yoga - Nearly full (16/20)

---

## 🔧 Technical Details

### Data Structure
Each session includes:
```typescript
{
  id: string
  startTime: ISO 8601 string (UTC)
  endTime: ISO 8601 string (UTC)
  price: number (VND, no decimals)
  maxParticipants: number
  currentEnrollments: number
  availableSlots: number
  status: SCHEDULED | ONGOING | COMPLETED | CANCELLED
  workshopTemplate: { ... }
  vendor: { ... }
}
```

### Price Format
- **Input**: `750000` (number)
- **Display**: `750.000 ₫` (formatted)
- **Locale**: `vi-VN`
- **Currency**: `VND`

### Time Format
- **Storage**: UTC ISO 8601 (e.g., `2026-02-13T06:30:00Z`)
- **Display**: Local time with 24-hour format (e.g., `06:30`)
- **Range**: All start times between 06:00 and 20:00 local time

---

## ✅ Validation

- ✅ All 15 sessions have valid start times (6 AM - 8 PM)
- ✅ All prices in VND (no USD)
- ✅ Realistic enrollment numbers
- ✅ Varied distribution across February
- ✅ Multiple sessions on same days (Feb 13)
- ✅ Different workshop types (Pottery & Yoga)
- ✅ All statuses represented (SCHEDULED, COMPLETED, CANCELLED)
- ✅ Edge cases covered (6 AM start, 8 PM end, fully booked, cancelled)

---

## 🚀 Ready for Testing!

The mock data now provides a comprehensive dataset for testing:
- Calendar views with varied session distributions
- Different time slots throughout the day
- VND currency display
- Realistic booking scenarios
- Edge cases and special situations

**Test away!** 🎉
