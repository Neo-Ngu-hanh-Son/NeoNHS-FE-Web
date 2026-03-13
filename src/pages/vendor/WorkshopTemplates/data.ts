import { WorkshopTemplateResponse, WorkshopStatus, WTagResponse } from "./types"

// Mock WTags
export const mockWTags: WTagResponse[] = [
  {
    id: "tag-1",
    name: "Arts & Crafts",
    description: "Creative and artistic workshops",
    tagColor: "#FF6B6B",
    iconUrl: null,
  },
  {
    id: "tag-2",
    name: "Culinary",
    description: "Food and cooking experiences",
    tagColor: "#FFA500",
    iconUrl: null,
  },
  {
    id: "tag-3",
    name: "Wellness",
    description: "Health and wellness activities",
    tagColor: "#4ECDC4",
    iconUrl: null,
  },
  {
    id: "tag-4",
    name: "Cultural",
    description: "Traditional and cultural experiences",
    tagColor: "#95E1D3",
    iconUrl: null,
  },
  {
    id: "tag-5",
    name: "Adventure",
    description: "Outdoor and adventure activities",
    tagColor: "#F38181",
    iconUrl: null,
  },
  {
    id: "tag-6",
    name: "Hands-On",
    description: "Interactive practical workshops",
    tagColor: "#AA96DA",
    iconUrl: null,
  },
]

// Mock Workshop Templates
export const mockWorkshopTemplates: WorkshopTemplateResponse[] = [
  {
    id: "template-1",
    name: "Traditional Pottery Workshop",
    shortDescription: "Learn the ancient art of pottery making from local artisans.",
    fullDescription: "Learn the ancient art of pottery making from local artisans. This hands-on workshop will teach you the basics of clay preparation, wheel throwing, and traditional glazing techniques passed down through generations. Perfect for beginners and experienced potters alike.",
    estimatedDuration: 180, // 3 hours in minutes
    defaultPrice: 45000000,
    minParticipants: 5,
    maxParticipants: 12,
    status: WorkshopStatus.ACTIVE,
    isPublished: true,
    averageRating: 4.8,
    totalReview: 24,
    vendorId: "vendor-1",
    vendorName: "Da Nang Arts Studio",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-01-20T14:30:00Z",
    adminNote: null,
    reviewedBy: "admin-1",
    reviewedAt: "2026-01-20T14:30:00Z",
    images: [
      {
        id: "img-1",
        imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800",
        isThumbnail: true,
      },
      {
        id: "img-2",
        imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        isThumbnail: false,
      },
    ],
    tags: [mockWTags[0], mockWTags[3], mockWTags[5]], // Arts & Crafts, Cultural, Hands-On
  },
  {
    id: "template-2",
    name: "Local Street Food Tour",
    shortDescription: "Explore the vibrant street food scene of Da Nang with a local guide.",
    fullDescription: "Explore the vibrant street food scene of Da Nang with a local guide. Sample authentic Vietnamese dishes from hidden gems known only to locals, including banh mi, fresh spring rolls, and regional specialties. Experience the culture through food!",
    estimatedDuration: 240, // 4 hours
    defaultPrice: 30000000,
    minParticipants: 4,
    maxParticipants: 15,
    status: WorkshopStatus.PENDING,
    isPublished: false,
    averageRating: null,
    totalReview: 0,
    vendorId: "vendor-1",
    vendorName: "Da Nang Arts Studio",
    createdAt: "2026-02-05T08:00:00Z",
    updatedAt: "2026-02-06T09:15:00Z",
    adminNote: null,
    reviewedBy: null,
    reviewedAt: null,
    images: [
      {
        id: "img-3",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        isThumbnail: true,
      },
    ],
    tags: [mockWTags[1], mockWTags[3]], // Culinary, Cultural
  },
  {
    id: "template-3",
    name: "Sunrise Meditation & Yoga",
    shortDescription: "Start your day with peaceful meditation and gentle yoga practice.",
    fullDescription: "Start your day with peaceful meditation and gentle yoga practice overlooking the stunning coastline. Our experienced instructor will guide you through breathing exercises and yoga poses suitable for all levels. Bring your own mat and enjoy the sunrise.",
    estimatedDuration: 120, // 2 hours
    defaultPrice: 25000000,
    minParticipants: 3,
    maxParticipants: 20,
    status: WorkshopStatus.ACTIVE,
    isPublished: true,
    averageRating: 4.9,
    totalReview: 45,
    vendorId: "vendor-1",
    vendorName: "Da Nang Arts Studio",
    createdAt: "2026-01-10T07:00:00Z",
    updatedAt: "2026-01-12T11:00:00Z",
    adminNote: null,
    reviewedBy: "admin-1",
    reviewedAt: "2026-01-12T11:00:00Z",
    images: [
      {
        id: "img-4",
        imageUrl: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800",
        isThumbnail: true,
      },
    ],
    tags: [mockWTags[2]], // Wellness
  },
  {
    id: "template-4",
    name: "Vietnamese Cooking Class",
    shortDescription: "Immerse yourself in Vietnamese cuisine with a comprehensive cooking class.",
    fullDescription: "Immerse yourself in Vietnamese cuisine with a comprehensive cooking class. Visit the local market to select fresh ingredients, then learn to prepare traditional dishes including pho, fresh spring rolls, and authentic fish sauce. Includes lunch with your creations!",
    estimatedDuration: 300, // 5 hours
    defaultPrice: 55000000,
    minParticipants: 4,
    maxParticipants: 10,
    status: WorkshopStatus.DRAFT,
    isPublished: false,
    averageRating: null,
    totalReview: 0,
    vendorId: "vendor-1",
    vendorName: "Da Nang Arts Studio",
    createdAt: "2026-02-10T15:30:00Z",
    updatedAt: "2026-02-10T15:30:00Z",
    adminNote: null,
    reviewedBy: null,
    reviewedAt: null,
    images: [
      {
        id: "img-5",
        imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
        isThumbnail: true,
      },
      {
        id: "img-6",
        imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800",
        isThumbnail: false,
      },
    ],
    tags: [mockWTags[1], mockWTags[3], mockWTags[5]], // Culinary, Cultural, Hands-On
  },
  {
    id: "template-5",
    name: "Photography Workshop",
    shortDescription: "Capture the beauty of Da Nang with professional photography guidance.",
    fullDescription: "Learn to capture stunning photos of Da Nang's landscapes and street life. Professional photographer will teach you composition, lighting, and editing techniques.",
    estimatedDuration: 180, // 3 hours
    defaultPrice: 40000000,
    minParticipants: 3,
    maxParticipants: 8,
    status: WorkshopStatus.REJECTED,
    isPublished: false,
    averageRating: null,
    totalReview: 0,
    vendorId: "vendor-1",
    vendorName: "Da Nang Arts Studio",
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-03T16:20:00Z",
    adminNote: "The images provided are low quality. Please upload higher resolution images showing the workshop activities clearly. Also, the full description needs more detail about what equipment participants need to bring.",
    reviewedBy: null,
    reviewedAt: null,
    images: [
      {
        id: "img-7",
        imageUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800",
        isThumbnail: true,
      },
    ],
    tags: [mockWTags[0], mockWTags[5]], // Arts & Crafts, Hands-On
  },
]
