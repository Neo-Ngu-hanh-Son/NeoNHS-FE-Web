// Date Formatting
export const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const formatDateTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

// Phone Number Formatting
export const formatPhoneNumber = (phone: string | null) => {
  if (!phone) return 'N/A'
  return phone
}

// Address Formatting
export const formatAddress = (address: string | null) => {
  if (!address) return 'No address provided'
  return address
}

// Bank Account Formatting
export const formatBankAccount = (bankName: string | null, accountNumber: string | null) => {
  if (!bankName || !accountNumber) return 'Not provided'
  return `${bankName} - ${accountNumber}`
}

// Status Display
export const getVerificationStatusText = (isVerified: boolean) => {
  return isVerified ? 'Verified' : 'Not Verified'
}

export const getActiveStatusText = (isActive: boolean) => {
  return isActive ? 'Active' : 'Inactive'
}

export const getBanStatusText = (isBanned: boolean) => {
  return isBanned ? 'Banned' : 'Active'
}

// Overall Status
export const getVendorOverallStatus = (isActive: boolean, isBanned: boolean) => {
  if (isBanned) return 'Banned'
  if (!isActive) return 'Inactive'
  return 'Active'
}

// Stats Formatting
export const formatCount = (count: number) => {
  return count.toString()
}

// Email masking for privacy
export const maskEmail = (email: string) => {
  const [name, domain] = email.split('@')
  if (name.length <= 2) return email
  return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`
}
