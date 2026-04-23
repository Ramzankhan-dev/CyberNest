/**
 * API Base Configuration
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const BASE_URL = API_BASE_URL;

/**
 * Authentication Endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH: `${API_BASE_URL}/auth/refresh-token`,
  VERIFY: `${API_BASE_URL}/auth/verify`,
};

/**
 * Device Management Endpoints
 */
export const DEVICE_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/devices`,
  GET_BY_ID: (deviceId) => `${API_BASE_URL}/devices/${deviceId}`,
  CREATE: `${API_BASE_URL}/devices/enroll`,
  UPDATE: (deviceId) => `${API_BASE_URL}/devices/${deviceId}`,
  DELETE: (deviceId) => `${API_BASE_URL}/devices/${deviceId}`,
  GET_GROUPS: `${API_BASE_URL}/devices/groups`,
  BULK_ACTION: `${API_BASE_URL}/devices/bulk-action`,
  GET_STATUS: (deviceId) => `${API_BASE_URL}/devices/${deviceId}/status`,
};

/**
 * Command Endpoints
 */
export const COMMAND_ENDPOINTS = {
  GET_AUDIT_LOG: `${API_BASE_URL}/commands/audit-log`,
  EXECUTE_COMMAND: `${API_BASE_URL}/commands/execute`,
  GET_COMMAND_STATUS: (commandId) => `${API_BASE_URL}/commands/${commandId}/status`,
  GET_POLICIES: `${API_BASE_URL}/commands/policies`,
  UPDATE_POLICY: (policyId) => `${API_BASE_URL}/commands/policies/${policyId}`,
};
//COMMANDS
/**
 * Available Device Commands for UI Buttons
 */
export const COMMANDS = [
  { id: 'lock', label: 'Lock Device', icon: 'Lock', color: 'text-amber-400' },
  { id: 'wipe', label: 'Factory Reset', icon: 'Trash2', color: 'text-red-500' },
  { id: 'restart', label: 'Restart', icon: 'RefreshCw', color: 'text-emerald-400' },
  { id: 'message', label: 'Send Message', icon: 'MessageSquare', color: 'text-cyan-400' },
  { id: 'locate', label: 'Locate', icon: 'MapPin', color: 'text-purple-400' }
];
/**
 * Admin Endpoints (Phase 3)
 */
export const ADMIN_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/admins`,
  GET_BY_ID: (adminId) => `${API_BASE_URL}/admins/${adminId}`,
  CREATE: `${API_BASE_URL}/admins`,
  UPDATE: (adminId) => `${API_BASE_URL}/admins/${adminId}`,
  DELETE: (adminId) => `${API_BASE_URL}/admins/${adminId}`,
  GET_PERMISSIONS: `${API_BASE_URL}/admins/permissions`,
  GET_ROLES: `${API_BASE_URL}/admins/roles`,
  ASSIGN_ROLE: (adminId) => `${API_BASE_URL}/admins/${adminId}/assign-role`,
};

/**
 * UI Constants
 */
export const DEVICE_GROUPS = [
  { value: 'all', label: 'All Groups' },
  { value: 'staff', label: 'Staff Devices' },
  { value: 'kiosk', label: 'Kiosk Devices' },
  { value: 'retail', label: 'Retail Displays' },
];

export const DEVICE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  IDLE: 'idle',
  LOCKED: 'locked',
  ERROR: 'error',
};

export const COMMAND_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PENDING: 'pending',
  RETRY: 'retry',
};

export const ADMIN_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'viewer', label: 'Viewer' },
];

/**
 * Mock Data for Development
 */
export const MOCK_DEVICES = [
  { id: 'SM-A725F-001', model: 'Samsung Galaxy A72', owner: 'John Doe', battery: 85, status: 'online', lastSeen: '2 mins ago', group: 'Staff Devices' },
  { id: 'iPad-Gen7-002', model: 'iPad (7th Gen)', owner: 'Jane Smith', battery: 12, status: 'online', lastSeen: '1 min ago', group: 'Kiosk Devices' },
  { id: 'Pixel-6Pro-003', model: 'Google Pixel 6 Pro', owner: 'Mike Johnson', battery: 45, status: 'online', lastSeen: '5 mins ago', group: 'Staff Devices' },
  { id: 'iPhone-14-004', model: 'iPhone 14 Pro', owner: 'Sarah Williams', battery: 92, status: 'offline', lastSeen: '45 mins ago', group: 'Staff Devices' },
  { id: 'Galaxy-S23-005', model: 'Samsung Galaxy S23', owner: 'David Brown', battery: 67, status: 'online', lastSeen: '3 mins ago', group: 'Kiosk Devices' },
];

export const MOCK_ACTIVITY_LOG = [
  '2024-01-15 14:32:18 - Device SM-A725F-023 connected',
  '2024-01-15 14:32:45 - Policy sync completed for 47 devices',
  '2024-01-15 14:33:12 - Battery alert: iPad-Gen7-015 at 12%',
  '2024-01-15 14:34:01 - Device Pixel-6Pro-042 policy enforced',
  '2024-01-15 14:34:22 - Offline: Galaxy-S10-089',
];

/**
 * Colors & Theme
 */
export const COLORS = {
  DARK_BG: '#020617',
  SLATE_950: '#030712',
  SLATE_900: '#0f172a',
  SLATE_800: '#1e293b',
  SLATE_700: '#334155',
  CYAN_400: '#22d3ee',
  EMERALD_400: '#34d399',
  RED_600: '#dc2626',
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'cybernest_auth_token',
  REFRESH_TOKEN: 'cybernest_refresh_token',
  USER_DATA: 'cybernest_user_data',
  PREFERENCES: 'cybernest_preferences',
};

// Added this line to fix the import error in api.js and other files
export const TOKEN_KEY = STORAGE_KEYS.AUTH_TOKEN;