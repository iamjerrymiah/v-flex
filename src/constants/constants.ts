export const API_URL = import.meta.env.VITE_API_URL ?? "";

export const storeToken = 'v_access_token'

export const statuses = {
    positive: ['active', 'good', 'done', 'accept', 'accepted', 'successful', 'completed', 'verified', 'yes', 'approved', 'passed', 'employed', 'paid', true],
    pending: ['pending', 'draft', 'processing', 'reviewing', 'pending_approval'],
    negative: ['unavailable', 'inactive', 'bad', 'reject', 'rejected', 'failed', 'no', 'denied', 'failed', 'declined', 'disapproved', 'cancelled', false],
    other: ['available', 'unresolved', 'registered', 'blocked'],
}

export const DEFAULT_SIZE_UNIT = 'px'