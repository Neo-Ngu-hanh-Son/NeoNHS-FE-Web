import { useState } from "react";
import { UserInfoCard } from "@/components/profile/UserInfoCard";
import { UserEditForm } from "@/components/profile/UserEditForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import type { User } from "@/types";
import { useAuth } from "@/hooks/auth/useAuth";

export function UserProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const handleProfileSaved = (updatedUser: User) => {
    updateUser(updatedUser);
  };

  if (!user) return null;

  const navItems = [
    { id: "profile", label: "Profile Information", icon: "person" },
    { id: "security", label: "Security & Password", icon: "security" },
    { id: "preferences", label: "Preferences", icon: "settings" },
    { id: "history", label: "Booking History", icon: "history" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Aside (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <nav className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Column: Main Content (8 cols) */}
          <main className="lg:col-span-8 space-y-8">
            <div className="min-h-[400px]">
              {activeTab === "profile" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <UserEditForm user={user} onSaved={handleProfileSaved} />
                  <UserInfoCard user={user} />
                </div>
              )}

              {activeTab === "security" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <ChangePasswordForm />
                </div>
              )}

              {(activeTab === "preferences" || activeTab === "history") && (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-12 border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95 duration-300 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 text-5xl mb-4">
                    construction
                  </span>
                  <h3 className="text-slate-900 dark:text-white font-bold text-lg">
                    Under Construction
                  </h3>
                  <p className="text-slate-500 text-sm">
                    This section is being redesigned to provide you with a better experience.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
