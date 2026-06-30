import type { PaymentProvider } from "./provider";
import { whatsappProvider } from "./whatsapp";

/**
 * Registry of all available payment providers.
 *
 * Future: add midtrans/xendit/stripe implementations and switch
 * `getActiveProvider()` based on env or a settings table.
 */
const providers: Record<string, PaymentProvider> = {
  whatsapp: whatsappProvider,
  // midtrans: midtransProvider, // TODO
  // xendit: xenditProvider,     // TODO
  // stripe: stripeProvider,     // TODO
};

export function getProvider(id: string): PaymentProvider {
  const p = providers[id];
  if (!p) throw new Error(`Unknown payment provider: ${id}`);
  return p;
}

export function getActiveProvider(): PaymentProvider {
  const id = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || "whatsapp";
  return getProvider(id);
}

export { whatsappProvider };
export type { PaymentProvider } from "./provider";
