import type { SupabaseClient } from '@supabase/supabase-js'

export type SecurityEventType =
  | 'user_registered'
  | 'login_success'
  | 'login_failure'
  | 'login_disabled_account'
  | 'password_reset_requested'
  | 'password_updated'
  | 'role_changed'
  | 'unauthorized_access_attempt'
  | 'session_expired'

/**
 * Log a security/audit event to the audit_log table via the
 * log_audit_event SECURITY DEFINER function.
 *
 * Safe to call from client components — the function enforces
 * server-side auth.uid() and cannot be spoofed.
 */
export async function logSecurityEvent(
  supabase: SupabaseClient,
  eventType: SecurityEventType,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    await supabase.rpc('log_audit_event', {
      p_event_type: eventType,
      p_metadata: metadata,
    })
  } catch {
    // Never throw from logging — fail silently in production
    if (process.env.NODE_ENV === 'development') {
      console.warn('[AuditLog] Failed to log event:', eventType, metadata)
    }
  }
}
