import { NavLink } from "react-router-dom";

type Props = {
  navItem: {
    label: string;
    path: string;
    icon: string;
    children: {
      label: string;
      path: string;
      icon: string;
    }[];
  };
  isCollapsed: boolean;
};

export default function NavlinkWithChildren({ navItem, isCollapsed }: Props) {
  return (
    <div key={navItem.path} className="relative group">
      {/* Parent */}
      <div
        className={`flex items-center gap-3 p-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white cursor-pointer transition-all ${
          isCollapsed ? "justify-center" : ""
        }`}
        title={isCollapsed ? navItem.label : ""}
      >
        <span className="material-symbols-outlined shrink-0">{navItem.icon}</span>
        {!isCollapsed && <p className="text-sm font-medium">{navItem.label}</p>}
        {!isCollapsed && (
          <span className="material-symbols-outlined shrink-0 text-sm">arrow_drop_down</span>
        )}
      </div>

      {/* Dropdown wrapper (keeps hover alive) */}
      <div
        className="
      absolute left-full top-0 pl-2
      opacity-0 translate-x-2 pointer-events-none
      transition-all duration-150 ease-out
      group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto z-50
    "
      >
        {/* Dropdown content */}
        <div className="flex flex-col gap-2 w-[220px] bg-sidebar-bg border border-white/10 rounded-lg p-2 shadow-lg">
          {navItem.children.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="material-symbols-outlined shrink-0">{child.icon}</span>
              <p className="text-sm font-medium whitespace-nowrap overflow-hidden">{child.label}</p>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
