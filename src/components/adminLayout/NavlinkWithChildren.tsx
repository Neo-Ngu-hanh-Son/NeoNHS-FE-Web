import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useIsActive } from '@/hooks/webRoute/useIsActive';

type NavChild = {
  label: string;
  path: string;
  icon: ReactNode;
};

type Props = {
  navItem: {
    label: string;
    path: string;
    icon: ReactNode;
    children?: NavChild[];
  };
  isCollapsed: boolean;
};

export default function NavlinkWithChildren({ navItem, isCollapsed }: Props) {
  const { checkActive } = useIsActive();

  const isAnyChildActive = navItem.children?.some((child) => checkActive(child.path));
  const isParentActive = checkActive(navItem.path, true) || isAnyChildActive;

  return (
    <div key={navItem.path} className="relative group">
      <div
        className={`flex items-center gap-3 p-2.5 rounded-lg text-white/70 hover:bg-white/5 hover:text-white cursor-pointer transition-all 
          ${isCollapsed ? 'justify-center' : ''}
          ${isParentActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}
        `}
        title={isCollapsed ? navItem.label : ''}
      >
        <span className="shrink-0">{navItem.icon}</span>
        {!isCollapsed && <p className="text-sm font-medium">{navItem.label}</p>}
        {!isCollapsed && <ChevronDown className="w-4 h-4 shrink-0" />}
      </div>

      <div
        className="
      absolute left-full top-0 pl-2
      opacity-0 translate-x-2 pointer-events-none
      transition-all duration-150 ease-out
      group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto z-50
    "
      >
        <div className="flex flex-col gap-2 w-[220px] bg-sidebar-bg border border-white/10 rounded-lg p-2 shadow-lg">
          {navItem.children?.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="shrink-0">{child.icon}</span>
              <p className="text-sm font-medium whitespace-nowrap overflow-hidden">{child.label}</p>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
