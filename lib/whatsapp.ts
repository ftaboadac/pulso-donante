import type { Donor } from "@/types/donor";

export function buildWaLink(donor: Donor, message: string) {
  const phone = donor.phone.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const buildWhatsAppLink = buildWaLink;
