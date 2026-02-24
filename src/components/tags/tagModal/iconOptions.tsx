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
  { key: "calendar-days", label: "Calendar", icon: CalendarDays, iconUrl: createLucideApiUrl("calendar-days") },
  { key: "clock-3", label: "Clock", icon: Clock3, iconUrl: createLucideApiUrl("clock-3") },
  { key: "map-pin", label: "Map Pin", icon: MapPin, iconUrl: createLucideApiUrl("map-pin") },
  { key: "ticket", label: "Ticket", icon: Ticket, iconUrl: createLucideApiUrl("ticket") },
  { key: "users", label: "Users", icon: Users, iconUrl: createLucideApiUrl("users") },
  { key: "music", label: "Music", icon: Music, iconUrl: createLucideApiUrl("music") },
  { key: "camera", label: "Camera", icon: Camera, iconUrl: createLucideApiUrl("camera") },
  { key: "utensils", label: "Food", icon: Utensils, iconUrl: createLucideApiUrl("utensils") },
  { key: "palette", label: "Art", icon: Palette, iconUrl: createLucideApiUrl("palette") },
  { key: "party-popper", label: "Party", icon: PartyPopper, iconUrl: createLucideApiUrl("party-popper") },
  { key: "sparkles", label: "Sparkles", icon: Sparkles, iconUrl: createLucideApiUrl("sparkles") },
  { key: "mountain", label: "Mountain", icon: Mountain, iconUrl: createLucideApiUrl("mountain") },
  { key: "compass", label: "Compass", icon: Compass, iconUrl: createLucideApiUrl("compass") },
  { key: "tent", label: "Camping", icon: Tent, iconUrl: createLucideApiUrl("tent") },
  { key: "bike", label: "Bike", icon: Bike, iconUrl: createLucideApiUrl("bike") },
  { key: "dumbbell", label: "Fitness", icon: Dumbbell, iconUrl: createLucideApiUrl("dumbbell") },
  { key: "book-open", label: "Learning", icon: BookOpen, iconUrl: createLucideApiUrl("book-open") },
  { key: "mic-2", label: "Microphone", icon: Mic2, iconUrl: createLucideApiUrl("mic-2") },
  { key: "briefcase", label: "Business", icon: Briefcase, iconUrl: createLucideApiUrl("briefcase") },
  { key: "heart-pulse", label: "Health", icon: HeartPulse, iconUrl: createLucideApiUrl("heart-pulse") },
  { key: "leaf", label: "Nature", icon: Leaf, iconUrl: createLucideApiUrl("leaf") },
  { key: "hammer", label: "Craft", icon: Hammer, iconUrl: createLucideApiUrl("hammer") },
  { key: "shirt", label: "Fashion", icon: Shirt, iconUrl: createLucideApiUrl("shirt") },
  { key: "coffee", label: "Coffee", icon: Coffee, iconUrl: createLucideApiUrl("coffee") },
  { key: "flame", label: "Fire", icon: Flame, iconUrl: createLucideApiUrl("flame") },
  { key: "trophy", label: "Achievement", icon: Trophy, iconUrl: createLucideApiUrl("trophy") },
  { key: "graduation-cap", label: "Education", icon: GraduationCap, iconUrl: createLucideApiUrl("graduation-cap") },
];
