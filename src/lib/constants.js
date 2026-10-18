// ===== User Roles =====
export const USER_ROLES = {
  USER: 'user',
  NGO: 'ngo',
  ADMIN: 'admin',
}

// ===== Verification Status =====
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

// ===== Emergency Severity =====
export const EMERGENCY_SEVERITY = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  CRITICAL: 'critical',
}

// ===== Emergency Status =====
export const EMERGENCY_STATUS = {
  REPORTED: 'reported',
  HELP_REQUESTED: 'help_requested',
  RESCUE_ACCEPTED: 'rescue_accepted',
  RESCUER_ON_WAY: 'rescuer_on_way',
  ANIMAL_PICKED_UP: 'animal_picked_up',
  AT_VET: 'at_veterinary_facility',
  TREATMENT_STARTED: 'treatment_started',
  TREATMENT_COMPLETED: 'treatment_completed',
  RESOLVED: 'resolved',
  FLAGGED_SPAM: 'flagged_spam',
}

// ===== Campaign Status =====
export const CAMPAIGN_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  SUSPENDED: 'suspended',
  FLAGGED: 'flagged',
}

// ===== Campaign Types =====
export const CAMPAIGN_TYPES = {
  DONATION: 'donation',
  SUPPLY: 'supply',
}

// ===== Volunteer Status =====
export const VOLUNTEER_STATUS = {
  APPLIED: 'applied',
  ACCEPTED: 'accepted',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
}

// ===== Animal Types =====
export const ANIMAL_TYPES = [
  { value: 'dog', label: 'Dogs', icon: '🐕' },
  { value: 'cat', label: 'Cats', icon: '🐈' },
  { value: 'bird', label: 'Birds', icon: '🐦' },
  { value: 'cattle', label: 'Cattle', icon: '🐄' },
  { value: 'wildlife', label: 'Wildlife', icon: '🦁' },
  { value: 'other', label: 'Other', icon: '🐾' },
]

// ===== NGO Services =====
export const NGO_SERVICES = [
  { value: 'rescue', label: 'Rescue', icon: '🚑' },
  { value: 'veterinary', label: 'Veterinary Assistance', icon: '🏥' },
  { value: 'shelter', label: 'Shelter', icon: '🏠' },
  { value: 'food', label: 'Food Distribution', icon: '🍚' },
  { value: 'adoption', label: 'Adoption', icon: '❤️' },
  { value: 'foster', label: 'Foster', icon: '🏡' },
  { value: 'sterilization', label: 'Sterilization', icon: '✂️' },
  { value: 'emergency', label: 'Emergency Response', icon: '🚨' },
]

// ===== NGO Organization Types =====
export const ORG_TYPES = [
  { value: 'trust', label: 'Trust' },
  { value: 'society', label: 'Society' },
  { value: 'section8', label: 'Section 8 Company' },
  { value: 'ngo', label: 'NGO' },
  { value: 'other', label: 'Other' },
]

// ===== Indian States =====
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry',
]

// ===== Indian Cities (major) =====
export const MAJOR_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad',
  'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow',
  'Kota', 'Surat', 'Kanpur', 'Nagpur', 'Indore',
  'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
]

// ===== Document Types for NGO Verification =====
export const DOCUMENT_TYPES = [
  { value: 'registration_certificate', label: 'Registration Certificate', required: true },
  { value: 'pan', label: 'PAN Card', required: true },
  { value: '12a_certificate', label: '12A Certificate', required: false },
  { value: '80g_certificate', label: '80G Certificate', required: false },
  { value: 'bank_details', label: 'Bank Account Details', required: true },
  { value: 'address_proof', label: 'Address Proof', required: true },
  { value: 'authorized_rep', label: 'Authorized Representative ID', required: true },
]

// ===== Admin Actions =====
export const ADMIN_ACTIONS = {
  APPROVE_NGO: 'approve_ngo',
  REJECT_NGO: 'reject_ngo',
  SUSPEND_CAMPAIGN: 'suspend_campaign',
  DELETE_EMERGENCY: 'delete_emergency',
  BAN_USER: 'ban_user',
  WARN_USER: 'warn_user',
  FLAG_SPAM: 'flag_spam',
  FREEZE_ACCOUNT: 'freeze_account',
}

// ===== Navigation Items =====
export const USER_NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/nearby-ngos', label: 'Nearby NGOs', icon: 'MapPin' },
]

export const NGO_NAV_ITEMS = [
  { path: '/ngo/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/ngo/dashboard/emergencies', label: 'Emergency Cases', icon: 'AlertTriangle' },
  { path: '/ngo/dashboard/volunteers', label: 'Volunteers', icon: 'Users' },
  { path: '/ngo/dashboard/donations', label: 'Donations', icon: 'Heart' },
  { path: '/ngo/dashboard/supplies', label: 'Supplies', icon: 'Package' },
  { path: '/ngo/dashboard/animals', label: 'Animals', icon: 'PawPrint' },
  { path: '/ngo/dashboard/campaigns', label: 'Past Campaigns', icon: 'History' },
  { path: '/ngo/dashboard/profile', label: 'Profile', icon: 'Building' },
  { path: '/ngo/dashboard/documents', label: 'Documents', icon: 'FileText' },
  { path: '/ngo/dashboard/settings', label: 'Settings', icon: 'Settings' },
]

export const ADMIN_NAV_ITEMS = [
  { path: '/admin', label: 'Overview', icon: 'LayoutDashboard' },
  { path: '/admin/verifications', label: 'Verifications', icon: 'ShieldCheck' },
  { path: '/admin/ngos', label: 'NGOs', icon: 'Building' },
  { path: '/admin/users', label: 'Users', icon: 'Users' },
  { path: '/admin/emergencies', label: 'Emergency Cases', icon: 'AlertTriangle' },
  { path: '/admin/campaigns', label: 'Campaigns & Donations', icon: 'Wallet' },
  { path: '/admin/reports', label: 'Reports', icon: 'Flag' },
  { path: '/admin/settings', label: 'Settings', icon: 'Settings' },
]
