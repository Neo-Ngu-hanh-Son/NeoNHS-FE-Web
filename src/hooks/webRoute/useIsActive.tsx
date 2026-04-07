import { useLocation, matchPath } from 'react-router-dom';

export function useIsActive() {
  const { pathname } = useLocation();

  /**
   * @param path The route to check against
   * @param end If true, only returns true if the paths match exactly (like NavLink's 'end' prop)
   */
  const checkActive = (path: string, end = false) => {
    return !!matchPath({ path, end }, pathname);
  };

  return { checkActive, pathname };
}
