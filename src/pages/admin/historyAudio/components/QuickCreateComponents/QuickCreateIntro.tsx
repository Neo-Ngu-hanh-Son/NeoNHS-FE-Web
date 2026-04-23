import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { motion } from 'framer-motion';
import { Sparkles, Wand } from 'lucide-react';

export default function QuickCreateIntro() {
  return (
    <Item
      variant="outline"
      className="relative overflow-hidden border-primary/20 bg-emerald-500/10 transition-all hover:bg-emerald-500/15"
    >
      {/* Background Decorative Orb */}
      <div className="gradient-orb-1 absolute -right-10 -top-10 h-32 w-32 bg-primary/20 opacity-50 blur-3xl" />

      <ItemMedia variant="icon" className="relative bg-primary shadow-lg shadow-primary/30">
        <motion.div
          animate={{ rotate: [0, -15, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Wand size={20} color="white" />
        </motion.div>

        {/* Animated Sparkles around the icon */}
        <motion.div
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -right-1 -top-1 text-yellow-400"
        >
          <Sparkles size={12} fill="currentColor" />
        </motion.div>
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="gradient-text-animated bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text font-bold text-transparent">
          Tạo nhanh âm thanh lịch sử với AI
        </ItemTitle>
        <ItemDescription className="max-w-[700px] leading-relaxed">
          Nhập các thông tin cơ bản và để <span className="font-semibold text-primary">AI</span> lo phần còn lại. Hệ
          thống sẽ tự động dịch thuật và cấu hình giọng đọc đa ngôn ngữ cho bạn chỉ trong tích tắc.
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
