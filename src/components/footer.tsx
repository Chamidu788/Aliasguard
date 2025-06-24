import Link from 'next/link';
import { ShieldCheck, ExternalLink } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Generator' },
  { href: '/about', label: 'About' },
];

const developers = [
    {
      name: 'Chamindu Kavishka',
      link: 'https://chamindu1.vercel.app',
    },
    {
      name: 'Maheshika Devindya',
      link: 'https://maheshika1.vercel.app',
    },
];

export default function Footer() {
  return (
    <footer className="bg-muted/50 text-muted-foreground border-t mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Column 1: Logo and Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <span className="font-bold text-lg text-foreground">AliasGuard</span>
            </Link>
            <p className="text-sm max-w-xs">
              Your simple, powerful, and private solution for generating and managing Gmail aliases.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Developers */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Developed By</h3>
            <ul className="space-y-2">
                {developers.map((dev) => (
                    <li key={dev.name}>
                        <Link href={dev.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-primary hover:underline">
                            {dev.name} <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                    </li>
                ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AliasGuard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
