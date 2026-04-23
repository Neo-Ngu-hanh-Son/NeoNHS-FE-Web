import { useEffect, useState } from "react";
import { message } from "antd";
import { VendorEditForm } from "@/components/profile/VendorEditForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import type { User, VendorProfile } from "@/types";
import VendorService from "@/services/api/vendorService";
import { useAuth } from "@/hooks/auth/useAuth";
import { Store, ShieldCheck } from "lucide-react";

export default function VendorProfilePage() {
  const { user, updateUser } = useAuth();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("business");

  useEffect(() => {
    if (user) {
      loadVendorData();
    }
  }, [user]);

  const loadVendorData = async () => {
    try {
      const vendorData = await VendorService.getVendorProfile();
      setVendor(vendorData);
    } catch (error: any) {
      message.error("Không thể tải dữ liệu đối tác");
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSaved = (updatedVendor: VendorProfile) => {
    setVendor(updatedVendor);
    updateUser(updatedVendor as unknown as User);
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (!vendor) return null;

  const tabs = [
    {
      id: "business",
      label: "Hồ sơ kinh doanh",
      icon: <Store className="w-4 h-4" />,
    },
    {
      id: "security",
      label: "Bảo mật tài khoản",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700 flex items-center gap-6 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "business" ? (
            <VendorEditForm vendor={vendor} onSaved={handleVendorSaved} />
          ) : (
            <div className="max-w-4xl">
              <ChangePasswordForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
