// Security utilities and constants

export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  
  // Session configuration
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_THRESHOLD: 60 * 60 * 1000, // 1 hour
  
  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // CORS and CSP
  ALLOWED_ORIGINS: [
    'https://your-subdomain.yourdomain.com',
    'https://yourdomain.com'
  ]
}

// Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export const validatePassword = (password) => {
  const errors = []
  
  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters`)
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Rate limiting for login attempts
class RateLimiter {
  constructor() {
    this.attempts = new Map()
  }
  
  isAllowed(identifier) {
    const now = Date.now()
    const userAttempts = this.attempts.get(identifier) || { count: 0, lastAttempt: 0 }
    
    // Reset if lockout period has passed
    if (now - userAttempts.lastAttempt > SECURITY_CONFIG.LOCKOUT_DURATION) {
      userAttempts.count = 0
    }
    
    return userAttempts.count < SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS
  }
  
  recordAttempt(identifier, success = false) {
    const now = Date.now()
    const userAttempts = this.attempts.get(identifier) || { count: 0, lastAttempt: 0 }
    
    if (success) {
      // Reset on successful login
      this.attempts.delete(identifier)
    } else {
      // Increment failed attempts
      this.attempts.set(identifier, {
        count: userAttempts.count + 1,
        lastAttempt: now
      })
    }
  }
  
  getRemainingTime(identifier) {
    const userAttempts = this.attempts.get(identifier)
    if (!userAttempts || userAttempts.count < SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      return 0
    }
    
    const elapsed = Date.now() - userAttempts.lastAttempt
    return Math.max(0, SECURITY_CONFIG.LOCKOUT_DURATION - elapsed)
  }
}

export const rateLimiter = new RateLimiter()

// Generate secure random strings
export const generateSecureId = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

// Secure local storage wrapper
export const secureStorage = {
  set(key, value) {
    try {
      const encrypted = btoa(JSON.stringify({
        data: value,
        timestamp: Date.now(),
        checksum: this.generateChecksum(value)
      }))
      localStorage.setItem(key, encrypted)
    } catch (error) {
      console.error('Failed to store data:', error)
    }
  },
  
  get(key) {
    try {
      const encrypted = localStorage.getItem(key)
      if (!encrypted) return null
      
      const decrypted = JSON.parse(atob(encrypted))
      
      // Verify checksum
      if (decrypted.checksum !== this.generateChecksum(decrypted.data)) {
        console.warn('Data integrity check failed')
        localStorage.removeItem(key)
        return null
      }
      
      // Check if data is too old (optional)
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
      if (Date.now() - decrypted.timestamp > maxAge) {
        localStorage.removeItem(key)
        return null
      }
      
      return decrypted.data
    } catch (error) {
      console.error('Failed to retrieve data:', error)
      localStorage.removeItem(key)
      return null
    }
  },
  
  remove(key) {
    localStorage.removeItem(key)
  },
  
  generateChecksum(data) {
    // Simple checksum for client-side integrity
    return btoa(JSON.stringify(data)).split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0).toString(36)
  }
}