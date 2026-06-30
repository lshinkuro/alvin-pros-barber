import type { Course, Profile } from "@/types/database";

/**
 * Future-ready payment provider abstraction.
 *
 * Today we use the WhatsApp "manual" provider (no online payment).
 * Tomorrow you can drop in Midtrans, Xendit, or Stripe — the rest of the
 * codebase only interacts with the PaymentProvider interface below.
 */

export interface CheckoutContext {
  course: Course;
  user: Profile;
  orderId?: string;
}

export interface CheckoutResult {
  /** "redirect" → navigate the browser to `url` (e.g. WhatsApp / Stripe Checkout). */
  /** "client_action" → caller performs an SDK call (e.g. Midtrans Snap). */
  /** "pending" → background flow, show waiting state. */
  type: "redirect" | "client_action" | "pending";
  url?: string;
  /** Provider-native payload (token, snap id, client_secret, etc.). */
  payload?: Record<string, unknown>;
}

export interface PaymentProvider {
  id: "whatsapp" | "midtrans" | "xendit" | "stripe";
  label: string;
  checkout(ctx: CheckoutContext): Promise<CheckoutResult>;
  /**
   * Verify a webhook / callback. Returns `true` if the order should be marked paid.
   * The default WhatsApp provider returns false because confirmation is manual.
   */
  verifyWebhook?(payload: unknown, headers: Headers): Promise<boolean>;
}
