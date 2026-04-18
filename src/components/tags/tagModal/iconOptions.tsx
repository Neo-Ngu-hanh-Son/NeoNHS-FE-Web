import type { LucideIcon } from "lucide-react";
import {
  Bike,
  BookOpen,
  Briefcase,
  CalendarDays,
  Camera,
  Clock3,
  Coffee,
  Compass,
  Dumbbell,
  Flame,
  GraduationCap,
  Hammer,
  HeartPulse,
  Leaf,
  MapPin,
  Mic2,
  Mountain,
  Music,
  Palette,
  PartyPopper,
  Shirt,
  Sparkles,
  Tent,
  Ticket,
  Trophy,
  Users,
  Utensils,
} from "lucide-react";

export interface TagIconOption {
  key: string;
  label: string;
  icon: LucideIcon;
  iconUrl: string;
}

const LUCIDE_ICON_API_BASE = "https://api.iconify.design/lucide:";

const createLucideApiUrl = (iconName: string): string => {
  return `${LUCIDE_ICON_API_BASE}${iconName}.svg`;
};

export const TAG_ICON_OPTIONS: TagIconOption[] = [
  { key: "calendar-days", label: "Lịch", icon: CalendarDays, iconUrl: createLucideApiUrl("calendar-days") },
  { key: "clock-3", label: "Đồng hồ", icon: Clock3, iconUrl: createLucideApiUrl("clock-3") },
  { key: "map-pin", label: "Vị trí", icon: MapPin, iconUrl: createLucideApiUrl("map-pin") },
  { key: "ticket", label: "Vé", icon: Ticket, iconUrl: createLucideApiUrl("ticket") },
  { key: "users", label: "Cộng đồng", icon: Users, iconUrl: createLucideApiUrl("users") },
  { key: "music", label: "Âm nhạc", icon: Music, iconUrl: createLucideApiUrl("music") },
  { key: "camera", label: "Máy ảnh", icon: Camera, iconUrl: createLucideApiUrl("camera") },
  { key: "utensils", label: "Ẩm thực", icon: Utensils, iconUrl: createLucideApiUrl("utensils") },
  { key: "palette", label: "Nghệ thuật", icon: Palette, iconUrl: createLucideApiUrl("palette") },
  { key: "party-popper", label: "Tiệc", icon: PartyPopper, iconUrl: createLucideApiUrl("party-popper") },
  { key: "sparkles", label: "Lấp lánh", icon: Sparkles, iconUrl: createLucideApiUrl("sparkles") },
  { key: "mountain", label: "Núi", icon: Mountain, iconUrl: createLucideApiUrl("mountain") },
  { key: "compass", label: "La bàn", icon: Compass, iconUrl: createLucideApiUrl("compass") },
  { key: "tent", label: "Cắm trại", icon: Tent, iconUrl: createLucideApiUrl("tent") },
  { key: "bike", label: "Xe đạp", icon: Bike, iconUrl: createLucideApiUrl("bike") },
  { key: "dumbbell", label: "Thể hình", icon: Dumbbell, iconUrl: createLucideApiUrl("dumbbell") },
  { key: "book-open", label: "Học tập", icon: BookOpen, iconUrl: createLucideApiUrl("book-open") },
  { key: "mic-2", label: "Micro", icon: Mic2, iconUrl: createLucideApiUrl("mic-2") },
  { key: "briefcase", label: "Kinh doanh", icon: Briefcase, iconUrl: createLucideApiUrl("briefcase") },
  { key: "heart-pulse", label: "Sức khỏe", icon: HeartPulse, iconUrl: createLucideApiUrl("heart-pulse") },
  { key: "leaf", label: "Thiên nhiên", icon: Leaf, iconUrl: createLucideApiUrl("leaf") },
  { key: "hammer", label: "Thủ công", icon: Hammer, iconUrl: createLucideApiUrl("hammer") },
  { key: "shirt", label: "Thời trang", icon: Shirt, iconUrl: createLucideApiUrl("shirt") },
  { key: "coffee", label: "Cà phê", icon: Coffee, iconUrl: createLucideApiUrl("coffee") },
  { key: "flame", label: "Lửa", icon: Flame, iconUrl: createLucideApiUrl("flame") },
  { key: "trophy", label: "Thành tích", icon: Trophy, iconUrl: createLucideApiUrl("trophy") },
  { key: "graduation-cap", label: "Giáo dục", icon: GraduationCap, iconUrl: createLucideApiUrl("graduation-cap") },
];
