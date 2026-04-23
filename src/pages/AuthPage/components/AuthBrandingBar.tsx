import { AppstoreOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { AuthLanguageToggle } from './AuthLanguageToggle'

export function AuthBrandingBar() {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <Link to="/" className="flex items-center gap-2 font-medium shrink-0">
      <img src="/src/assets/images/NeoNHSLogo_Optimized.jpg" alt="NeoNHS Logo" className="w-9 h-9 rounded-full" />
        NeoNHS
      </Link>
      <AuthLanguageToggle />
    </div>
  )
}
