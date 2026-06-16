'use client'

import { Scissors, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-b from-background to-muted/50 border-t pt-12 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold shimmer-text">Chohan's Style Hub</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Premium multi-branch hair salon & beauty academy. Where style meets excellence.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-brand-gradient hover:text-white transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-brand-gradient hover:text-white transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-brand-gradient hover:text-white transition">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition">Men's Services</a></li>
              <li><a href="#" className="hover:text-primary transition">Women's Services</a></li>
              <li><a href="#" className="hover:text-primary transition">Bridal Packages</a></li>
              <li><a href="#" className="hover:text-primary transition">Beauty Courses</a></li>
              <li><a href="#" className="hover:text-primary transition">Book Appointment</a></li>
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h4 className="font-semibold mb-3">Our Branches</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="w-3 h-3 mt-1 shrink-0" /> Gulberg III, Lahore</li>
              <li className="flex items-start gap-2"><MapPin className="w-3 h-3 mt-1 shrink-0" /> DHA Phase 5, Lahore</li>
              <li className="flex items-start gap-2"><MapPin className="w-3 h-3 mt-1 shrink-0" /> Johar Town, Lahore</li>
              <li className="flex items-start gap-2"><MapPin className="w-3 h-3 mt-1 shrink-0" /> Bahria Town, Rawalpindi</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> <a href="tel:+923205719979" className="hover:text-primary">+92 320 5719979</a></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> <a href="mailto:info@chohans.com" className="hover:text-primary">info@chohans.com</a></li>
              <li className="flex items-center gap-2"><Scissors className="w-4 h-4 text-primary" /> Open Daily: 9 AM – 10 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Chohan's Style Hub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
