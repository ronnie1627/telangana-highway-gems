import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919000000000?text=Hi%20KK%20Realtors%2C%20I%27m%20interested%20in%20your%20properties"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[oklch(0.72_0.18_145)] text-white shadow-luxe transition-transform hover:scale-110"
    >
      <MessageCircle size={26} fill="currentColor" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[oklch(0.72_0.18_145)] opacity-30" />
    </a>
  );
}