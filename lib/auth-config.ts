export const AUTH_CONFIG = {
  // Admin email - set this to your admin email
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@yoursurveyapp.com",
  // Session duration in seconds (24 hours)
  SESSION_DURATION: 24 * 60 * 60,
  // Maximum login attempts before lockout
  MAX_LOGIN_ATTEMPTS: 5,
  // Lockout duration in minutes
  LOCKOUT_DURATION: 15,
}
