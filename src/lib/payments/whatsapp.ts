import type { CheckoutContext, PaymentProvider } from "./provider";

export const whatsappProvider: PaymentProvider = {
  id: "whatsapp",
  label: "Manual confirmation via WhatsApp",
  async checkout({ course, user }: CheckoutContext) {
    const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
      /\D/g,
      "",
    );
    const message = [
      "Hello Admin,",
      "",
      "I would like to purchase this course.",
      "",
      "Course:",
      course.title,
      "",
      "Name:",
      user.name,
      "",
      "Email:",
      user.email,
      "",
      "Thank you.",
    ].join("\n");

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    return { type: "redirect", url };
  },
};
