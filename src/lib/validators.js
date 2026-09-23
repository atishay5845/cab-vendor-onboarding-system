/**
 * Input validation helpers for onboarding forms.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^(\+91[\-\s]?)?[0-9]{10}$/;
export const VEHICLE_REG_REGEX = /^[A-Z]{2}\s?[0-9]{2}\s?[A-Z]{1,2}\s?[0-9]{4}$/i;
export const LICENSE_REGEX = /^[A-Z]{2}[0-9]{2}\s?[0-9]{11}$/i;

export function validateEmail(email) {
  return EMAIL_REGEX.test(email.trim());
}

export function validatePhone(phone) {
  return PHONE_REGEX.test(phone.trim());
}

export function validateVehicleReg(regNo) {
  return VEHICLE_REG_REGEX.test(regNo.trim());
}

export function validateLicenseNo(licenseNo) {
  return LICENSE_REGEX.test(licenseNo.trim());
}

export function isDocExpired(expiryDate) {
  if (!expiryDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  return exp < today;
}
