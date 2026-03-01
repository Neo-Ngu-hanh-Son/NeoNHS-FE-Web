import { AdminWorkshopTemplateResponse, AdminTemplateStats, WorkshopStatus } from "./types"
import { mockWTags } from "@/pages/vendor/WorkshopTemplates/data"

// Mock workshop templates for admin review (from various vendors)
export const mockAdminTemplates: AdminWorkshopTemplateResponse[] = [
  // PENDING templates (awaiting review)
  {
    id: "admin-template-1",
    name: "Traditional Vietnamese Silk Painting",
    shortDescription: "Learn the art of Vietnamese silk painting with master artists.",
    fullDescription:
      "Experience the delicate art of Vietnamese silk painting. Our expert instructors will guide you through the traditional techniques of painting on silk, including color mixing, brush techniques, and finishing methods. Create your own beautiful silk artwork to take home!",
    estimatedDuration: 180,
    defaultPrice: 850000,
    minParticipants: 4,
    maxParticipants: 10,
    status: WorkshopStatus.PENDING,
    averageRating: null,
    totalReview: 0,
    vendorId: "vendor-2",
    vendorName: "Saigon Cooking School",
    vendorEmail: "saigon.cooking@gmail.com",
    vendorPhone: "+84 906 234 567",
    vendorVerified: true,
    createdAt: "2026-02-08T10:00:00Z",
    updatedAt: "2026-02-09T14:30:00Z",
    submittedAt: "2026-02-09T14:30:00Z",
    adminNote: null,
    reviewedBy: null,
    reviewedAt: null,
    reviewedBy: null,
    reviewedAt: null,
    images: [
      {
        id: "img-p1",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
        isThumbnail: true,
      },
    ],
    tags: [mockWTags[0], mockWTags[3]], // Arts & Crafts, Cultural
  },
  {
    id: "admin-template-2",
    name: "Pho Cooking Masterclass",
    shortDescription: "Master the art of making authentic Vietnamese Pho from scratch.",
    fullDescription:
      "Learn to make the iconic Vietnamese pho from a professional chef. We'll cover everything from preparing the perfect broth to assembling the dish with the right proportions. Includes market tour and full lunch.",
    estimatedDuration: 240,
    defaultPrice: 950000,
    minParticipants: 6,
    maxParticipants: 12,
    status: WorkshopStatus.PENDING,
    averageRating: null,
    totalReview: 0,
    vendorId: "vendor-7",
    vendorName: "Can Tho River Tours",
    vendorEmail: "cantho.boat@gmail.com",
    vendorPhone: "+84 911 789 012",
    vendorVerified: true,
    createdAt: "2026-02-07T09:00:00Z",
    updatedAt: "2026-02-10T16:00:00Z",
    submittedAt: "2026-02-10T16:00:00Z",
    adminNote: null,
    reviewedBy: null,
    reviewedAt: null,
    reviewedBy: null,
    reviewedAt: null,
    images: [
      {
        id: "img-p2",
        imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800",
        isThumbnail: true,
      },
    ],
    tags: [mockWTags[1], mockWTags[3], mockWTags[5]], // Culinary, Cultural, Hands-On
  },
  {
    id: "admin-template-3",
    name: "Meditation & Mindfulness Retreat",
    shortDescription: "Half-day meditation and mindfulness practice in peaceful surroundings.",
    fullDescription:
      "Join our experienced meditation instructors for a transformative half-day retreat. Learn various meditation techniques, breathing exercises, and mindfulness practices. Perfect for beginners and experienced practitioners.",
    estimatedDuration: 240,
    defaultPrice: 650000,
    minParticipants: 5,
    maxParticipants: 20,
    status: WorkshopStatus.PENDING,
    averageRating: null,
    totalReview: 0,
    vendorId: "vendor-4",
    vendorName: "Hue Cultural Tours",
    vendorEmail: "hue.culture@gmail.com",
    vendorPhone: "+84 908 456 789",
    vendorVerified: false, // Not verified vendor
    createdAt: "2026-02-09T08:30:00Z",
    updatedAt: "2026-02-11T10:00:00Z",
    submittedAt: "2026-02-11T10:00:00Z",
    adminNote: null,
    reviewedBy: null,
    reviewedAt: null,
    reviewedBy: null,
    reviewedAt: null,
    images: [
      {
        id: "img-p3",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
        isThumbnail: true,
      },
    ],
    tags: [mockWTags[2]], // Wellness
  },

  // ACTIVE templates (already approved)
  {
    id: "admin-template-4",
    name: "Traditional Pottery Workshop",
    shortDescription: "Learn the ancient art of pottery making from local artisans.",
    fullDescription:
      "Learn the ancient art of pottery making from local artisans. This hands-on workshop will teach you the basics of clay preparation, wheel throwing, and traditional glazing techniques passed down through generations.",
    estimatedDuration: 180,
    defaultPrice: 750000,
    minParticipants: 5,
    maxParticipants: 12,
    status: WorkshopStatus.ACTIVE,
    averageRating: 4.8,
    totalReview: 24,
    vendorId: "vendor-1",
    vendorName: "Da Nang Arts Studio",
    vendorEmail: "danang.arts@gmail.com",
    vendorPhone: "+84 905 123 456",
    vendorVerified: true,
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-01-20T14:30:00Z",
    submittedAt: "2026-01-16T09:00:00Z",
    adminNote: null,
    reviewedBy: "admin-1",
    reviewedAt: "2026-01-20T14:30:00Z",
    reviewedBy: "admin-1",
    reviewedAt: "2026-01-20T14:30:00Z",
    images: [
      {
        id: "img-a1",
        imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
        isThumbnail: true,
      },
    ],
    tags: [mockWTags[0], mockWTags[3], mockWTags[5]], // Arts & Crafts, Cultural, Hands-On
  },

  // REJECTED templates
  {
    id: "admin-template-5",
    name: "Scuba Diving Experience",
    shortDescription: "Beginner scuba diving course with certified instructors.",
    fullDescription:
      "Try scuba diving for the first time! Our certified instructors will teach you basic diving skills and safety procedures. Equipment included.",
    estimatedDuration: 300,
    defaultPrice: 1200000,
    minParticipants: 2,
    maxParticipants: 6,
    status: WorkshopStatus.REJECTED,
    averageRating: null,
    totalReview: 0,
    vendorId: "vendor-10",
    vendorName: "Vung Tau Beach Sports",
    vendorEmail: "vungtau.beach@gmail.com",
    vendorPhone: "+84 913 901 234",
    vendorVerified: false,
    createdAt: "2026-02-01T11:00:00Z",
    updatedAt: "2026-02-05T16:00:00Z",
    submittedAt: "2026-02-02T10:00:00Z",
    adminNote:
      "Missing required safety certifications and insurance documentation. Please provide: 1) Valid instructor certifications from recognized diving organizations (PADI, SSI, etc.), 2) Liability insurance coverage details, 3) Emergency contact procedures and medical support information. Once these documents are submitted, you may resubmit this template.",
    reviewedBy: null,
    reviewedAt: null,
    reviewedBy: "admin-2",
    reviewedAt: "2026-02-05T16:00:00Z",
    images: [
      {
        id: "img-r1",
        imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        isThumbnail: true,
      },
    ],
    tags: [mockWTags[4]], // Adventure
  },
]

// Calculate template stats
export const calculateAdminTemplateStats = (
  templates: AdminWorkshopTemplateResponse[],
): AdminTemplateStats => {
  return {
    total: templates.length,
    pending: templates.filter((t) => t.status === WorkshopStatus.PENDING).length,
    approved: templates.filter((t) => t.status === WorkshopStatus.ACTIVE).length,
    rejected: templates.filter((t) => t.status === WorkshopStatus.REJECTED).length,
    draft: templates.filter((t) => t.status === WorkshopStatus.DRAFT).length,
  }
}

export const mockAdminTemplateStats = calculateAdminTemplateStats(mockAdminTemplates)

