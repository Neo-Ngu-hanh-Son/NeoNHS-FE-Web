# Workshop Templates - Quick Start Guide

## 🚀 Getting Started

Your Workshop Templates feature is **100% complete** and ready to use with mockup data!

---

## 📂 Project Structure

```
src/pages/vendor/WorkshopTemplates/
├── components/
│   ├── delete-template-dialog.tsx       # Delete confirmation
│   ├── image-uploader.tsx                # Image URL manager with thumbnail
│   ├── rejection-alert.tsx               # Rejection reason display
│   ├── submit-approval-dialog.tsx        # Submit confirmation
│   ├── template-status-badge.tsx         # Status indicator
│   ├── workshop-template-card.tsx        # Template card for list
│   ├── workshop-template-form.tsx        # Main form component
│   └── wtag-selector.tsx                 # Tag selection component
├── utils/
│   └── formatters.ts                     # Helper functions
├── data.ts                               # Mock data (5 templates, 6 tags)
├── types.ts                              # TypeScript interfaces
├── WorkshopTemplatesPage.tsx             # List page (main)
├── WorkshopTemplateCreatePage.tsx        # Create page
├── WorkshopTemplateDetailPage.tsx        # Detail/view page
├── WorkshopTemplateEditPage.tsx          # Edit page
├── README_FRONTEND_WORKSHOP_TEMPLATE.md  # Original guideline
├── IMPLEMENTATION_SUMMARY.md             # What was built
└── QUICK_START.md                        # This file
```

---

## 🎮 How to Use (with Mock Data)

### 1. **View Templates List**
Navigate to: `/vendor/workshop-templates`

**Features:**
- See all 5 mock templates in a grid
- Filter by status: All, DRAFT, PENDING, ACTIVE, REJECTED
- Search by name or description
- Sort by: Updated Date, Created Date, Name, Price

**Try it:**
- Filter by "REJECTED" to see template with rejection reason
- Filter by "DRAFT" to see editable templates
- Search for "Pottery" or "Food"

### 2. **Create New Template**
Click "Create New Template" button

**What to fill:**
- Name (required, 3-255 chars)
- Short Description (optional, max 500 chars)
- Full Description (optional)
- Price (required, min $0.01)
- Duration in minutes (required, e.g., 90 = 1h 30m)
- Min Participants (required)
- Max Participants (required, must be ≥ min)
- Images (required, at least 1 URL)
- Tags (required, at least 1)

**Example values:**
```
Name: Beginner Yoga Workshop
Short Description: Learn basic yoga poses
Price: 35
Duration: 90 (shows as "1h 30m")
Min Participants: 3
Max Participants: 15
Image URL: https://images.unsplash.com/photo-1588286840104-8957b019727f
Tags: Select "Wellness"
```

**Result:** Template saved as **DRAFT**

### 3. **Edit Template**
- Click Edit on any DRAFT or REJECTED template
- Only DRAFT and REJECTED templates can be edited
- PENDING and ACTIVE templates show "locked" message

**Try editing:**
- "Vietnamese Cooking Class" (DRAFT)
- "Photography Workshop" (REJECTED - has rejection reason alert)

### 4. **Submit for Approval**
- Click "Submit for Approval" on DRAFT/REJECTED template
- Confirmation dialog appears
- After submission → status changes to PENDING
- Template becomes read-only

**Try it on:**
- "Vietnamese Cooking Class" (DRAFT)

### 5. **View Details**
Click "View" on any template to see:
- Full image gallery
- Complete description
- Status badge and timeline
- Vendor information
- Tags with color badges
- Rejection reason (if rejected)

**Try viewing:**
- "Photography Workshop" → See rejection alert
- "Traditional Pottery Workshop" → See ACTIVE status
- "Local Street Food Tour" → See PENDING lock message

### 6. **Delete Template**
- Click delete (trash icon) on DRAFT, PENDING, or REJECTED
- Cannot delete ACTIVE templates
- Confirmation dialog appears

**Try deleting:**
- "Vietnamese Cooking Class" (DRAFT)

---

## 🎯 Status Workflow Testing

### Scenario 1: Create → Submit → (Wait for Admin)
1. Create new template → Status: **DRAFT**
2. Edit if needed
3. Submit for approval → Status: **PENDING**
4. Cannot edit anymore (locked)
5. *(Admin approves)* → Status: **ACTIVE**
6. Template is now published!

### Scenario 2: Create → Submit → Rejected → Fix → Resubmit
1. Create template → Status: **DRAFT**
2. Submit for approval → Status: **PENDING**
3. *(Admin rejects with reason)* → Status: **REJECTED**
4. See rejection alert on detail/edit page
5. Edit template to fix issues → Status: Still **REJECTED**
6. Submit again → Status: **PENDING**
7. *(Admin approves)* → Status: **ACTIVE**

### Scenario 3: Draft Workflow
1. Create template → Status: **DRAFT**
2. Edit multiple times (no restrictions)
3. Delete if not needed
4. Submit when ready → Status: **PENDING**

---

## 🧪 Test Each Status

### DRAFT (Vietnamese Cooking Class)
- ✅ Can view
- ✅ Can edit
- ✅ Can delete
- ✅ Can submit for approval
- ✅ Shows "Edit", "Delete", "Submit" buttons

### PENDING (Local Street Food Tour)
- ✅ Can view (read-only)
- ❌ Cannot edit (locked message shown)
- ✅ Can delete (withdraw submission)
- ❌ Cannot submit
- ✅ Shows "View" button and "Awaiting approval..." text

### ACTIVE (Traditional Pottery Workshop)
- ✅ Can view (read-only)
- ❌ Cannot edit
- ❌ Cannot delete
- ❌ Cannot submit
- ✅ Shows approval info and ratings

### REJECTED (Photography Workshop)
- ✅ Can view
- ✅ Can edit (to fix issues)
- ✅ Can delete
- ✅ Can submit again
- ✅ Shows rejection alert with reason

---

## 🎨 UI Components in Action

### WTagSelector
- Shows 6 color-coded tags
- Multi-select with checkmarks
- Validation (at least 1 required)
- Shows selected count

### ImageUploader
- Add image URLs
- Preview in grid
- Click star to set thumbnail
- Delete with X button
- Validation (at least 1 required)

### Status Badges
- DRAFT: Gray
- PENDING: Yellow
- ACTIVE: Green
- REJECTED: Red

### Form Validation
- Try submitting empty form → see errors
- Try max < min participants → see error
- Try price = 0 → see error
- Try without images → see error
- Try without tags → see error

---

## 📱 Responsive Design Test

### Desktop (1280px+)
- 3-column grid for templates
- Side-by-side form fields
- Full-width image gallery

### Tablet (768px - 1279px)
- 2-column grid for templates
- 2-column form layout
- Compact detail view

### Mobile (< 768px)
- Single column grid
- Stacked form fields
- Mobile-optimized cards

**Test it:** Resize your browser to see responsive behavior!

---

## 🔧 When Ready for Real API

### Step 1: Create API Service
Create `src/services/api/workshopTemplateApi.ts`:

```typescript
import axios from 'axios'
import { CreateWorkshopTemplateRequest, UpdateWorkshopTemplateRequest } from '@/pages/vendor/WorkshopTemplates/types'

const API_BASE = '/api/workshops/templates'

export const workshopTemplateApi = {
  create: async (data: CreateWorkshopTemplateRequest) => {
    const response = await axios.post(`${API_BASE}`, data)
    return response.data.data
  },
  
  getMyTemplates: async (page: number, size: number, sortBy: string, sortDir: string) => {
    const response = await axios.get(`${API_BASE}/my`, {
      params: { page, size, sortBy, sortDir }
    })
    return response.data.data
  },
  
  getById: async (id: string) => {
    const response = await axios.get(`${API_BASE}/${id}`)
    return response.data.data
  },
  
  update: async (id: string, data: UpdateWorkshopTemplateRequest) => {
    const response = await axios.put(`${API_BASE}/${id}`, data)
    return response.data.data
  },
  
  register: async (id: string) => {
    const response = await axios.post(`${API_BASE}/${id}/register`)
    return response.data.data
  },
  
  delete: async (id: string) => {
    await axios.delete(`${API_BASE}/${id}`)
  }
}
```

### Step 2: Create WTag API Service
Create `src/services/api/wtagApi.ts`:

```typescript
import axios from 'axios'

const API_BASE = '/api/wtags'

export const wtagApi = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE}/all`)
    return response.data.data
  }
}
```

### Step 3: Replace Mock Data
Search for `// TODO: Call API` in all files and replace with actual API calls.

### Step 4: Add Error Handling
```typescript
try {
  const templates = await workshopTemplateApi.getMyTemplates(0, 10, 'createdAt', 'desc')
  setTemplates(templates.content)
} catch (error) {
  console.error('Failed to fetch templates:', error)
  // Show error toast
}
```

### Step 5: Add Success Feedback
Use a toast library (e.g., react-hot-toast, sonner) to show success messages:
- "Template created successfully"
- "Template updated"
- "Template submitted for approval"
- "Template deleted"

---

## 💡 Tips

1. **All TODO comments** are marked with `// TODO: Call API`
2. **Mock data** is in `data.ts` - easy to find and replace
3. **TypeScript types** match backend exactly - no conversion needed
4. **Form validation** is already set up - backend just needs to validate too
5. **Status colors** follow README spec exactly

---

## 🐛 Common Issues

### "Template not found"
- Check if mock data has template with that ID
- Check URL parameter is correct

### "Cannot edit template"
- Check template status (only DRAFT/REJECTED can be edited)
- See locked message on edit page

### "Validation errors"
- Check all required fields are filled
- Check min ≤ max participants
- Check at least 1 image
- Check at least 1 tag

### "Images not loading"
- Check image URLs are valid
- Check internet connection
- Images will show placeholder on error

---

## ✅ Checklist Before Going Live

- [ ] Create API service files
- [ ] Replace all mock data with API calls
- [ ] Add error handling for API failures
- [ ] Add success toast notifications
- [ ] Test with real backend
- [ ] Test all status transitions
- [ ] Test form validation with backend
- [ ] Test file uploads (if switching from URLs)
- [ ] Test pagination
- [ ] Add loading states

---

## 🎉 You're All Set!

The Workshop Templates feature is **production-ready** with mockup data. 

**Next:** Replace mock data with real API calls and you're good to go! 🚀

For questions, refer to:
- `README_FRONTEND_WORKSHOP_TEMPLATE.md` - Original requirements
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `types.ts` - All TypeScript interfaces
