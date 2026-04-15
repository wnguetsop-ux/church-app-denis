const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/communautedesfilsdemalachie4',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@communauteinternationalede1948',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@communaut.fils.de',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.79a4.85 4.85 0 01-1-.1z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="hidden md:block bg-cifm-blue-700 text-white px-4 py-10 mt-16">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <p className="font-lora text-lg font-semibold">
          Communaut&eacute; Internationale des Fils de Malachie 4
        </p>
        <p className="text-blue-200 text-sm">
          CIFM4 &middot; tadumdenis@gmail.com
        </p>

        {/* Social links */}
        <div className="flex justify-center gap-3 pt-1">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              {link.icon}
            </a>
          ))}
        </div>

        <p className="text-blue-300/60 text-xs pt-2">
          &copy; {new Date().getFullYear()} CIFM4 &middot; communautedesfilsdemalachie4.com
        </p>
      </div>
    </footer>
  )
}
