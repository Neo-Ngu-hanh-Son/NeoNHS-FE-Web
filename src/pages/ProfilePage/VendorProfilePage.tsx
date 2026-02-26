import { useEffect, useState } from "react";
import { message } from "antd";
import { VendorEditForm } from "@/components/profile/VendorEditForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import type { User, VendorProfile } from "@/types";
import VendorService from "@/services/api/vendorService";
import { useAuth } from "@/hooks/auth/useAuth";

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
      message.error("Failed to load vendor data");
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vendor) return null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Vendor Page Content */}
      <div className="space-y-8">
        {/* Content Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-8 px-2">
          <button
            onClick={() => setActiveTab("business")}
            className={`pb-4 px-2 text-sm font-bold transition-all relative ${
              activeTab === "business"
                ? "text-primary"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            Business Profile
            {activeTab === "business" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-4 px-2 text-sm font-bold transition-all relative ${
              activeTab === "security"
                ? "text-primary"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            Security Settings
            {activeTab === "security" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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
