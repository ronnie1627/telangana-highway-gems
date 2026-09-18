import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { storageImageUrl } from "@/lib/asset-url";

const logoUrl = storageImageUrl("properties/kk-realtors-logo.png");

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border bg-card/40">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-4 lg:px-10">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="KK Realtors"
              className="h-32 w-auto object-contain"
            />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Affordable open plots, HMDA approved villas and farm lands across Telangana's
            fastest-growing highway corridors.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://www.instagram.com/kkrealtors02/" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold">
              <Instagram size={16} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61594123948135" target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold">
              <Facebook size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.25em] text-gold">Explore</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li><Link to="/properties" className="hover:text-foreground">Properties</Link></li>
            <li><Link to="/investors" className="hover:text-foreground">Investors</Link></li>
            <li><Link to="/gallery" className="hover:text-foreground">Gallery</Link></li>
            <li><Link to="/emi-calculator" className="hover:text-foreground">EMI Calculator</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.25em] text-gold">Corridors</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li>Mumbai Highway</li>
            <li>Bangalore Highway</li>
            <li>Vijayawada Highway</li>
            <li>Srisailam Highway</li>
            <li>Warangal Highway</li>
            <li>Shadnagar • Zaheerabad</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.25em] text-gold">Contact</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-gold" /> Hyderabad, Telangana, India</li>
            <li className="flex items-center gap-3"><Phone size={16} className="text-gold" /> +91 8247532795</li>
            <li className="flex items-center gap-3"><Mail size={16} className="text-gold" /><a href="mailto:KKrealtors02@gmail.com" className="hover:text-gold">KKrealtors02@gmail.com</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} KK Realtors. All rights reserved.</p>
          <p>HMDA • DTCP • LRS • RERA verified layouts</p>
        </div>
      </div>
    </footer>
  );
}
