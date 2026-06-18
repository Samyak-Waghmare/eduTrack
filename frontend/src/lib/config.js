

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
).replace(/\/$/, "");

export const API_ROOT = `${API_BASE_URL}/api/v1`;

export const USER_API = `${API_ROOT}/user/`;
export const COURSE_API = `${API_ROOT}/course/`;
export const PURCHASE_API = `${API_ROOT}/purchase/`;
export const PROGRESS_API = `${API_ROOT}/progress/`;
export const ADMIN_API = `${API_ROOT}/admin/`;
export const ENGAGEMENT_API = `${API_ROOT}/engagement/`;
export const ANALYTICS_API = `${API_ROOT}/analytics/`;
export const NOTE_API = `${API_ROOT}/note/`;
