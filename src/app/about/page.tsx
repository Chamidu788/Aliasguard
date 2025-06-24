import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const developers = [
  {
    name: 'Chamindu Kavishka',
    link: 'https://chamindu1.vercel.app',
    avatar: 'https://res.cloudinary.com/dwvkuqd1i/image/upload/v1750770548/chamindu_riincp.jpg',
    initials: 'CK',
    aiHint: 'male portrait',
  },
  {
    name: 'Maheshika Devindya',
    link: 'https://maheshika1.vercel.app',
    avatar: 'https://res.cloudinary.com/dwvkuqd1i/image/upload/v1750770554/me_zdcxrw.png',
    initials: 'MD',
    aiHint: 'female portrait',
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <ShieldCheck className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">About AliasGuard</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Your simple, powerful, and private solution for generating and managing Gmail aliases. Take control of your inbox.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>What is AliasGuard?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              AliasGuard leverages a built-in Gmail feature that lets you create infinite variations of your email address. By adding a `+tag` or `.` dots to your username, you can create unique aliases that all deliver to your main inbox.
            </p>
            <p>
              This is perfect for signing up for newsletters, new services, or anywhere you need to provide an email. If an alias starts receiving spam, you know exactly who sold your data, and you can create a filter to automatically delete those emails.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>Instant alias generation with multiple methods.</li>
              <li>Bulk generation to create many aliases at once.</li>
              <li>Secure, client-side storage of your alias history.</li>
              <li>One-click copy and history export (CSV).</li>
              <li>Clean, responsive interface with a dark mode theme.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">Developed By</h2>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-8">
            {developers.map((dev) => (
                <Card key={dev.name} className="flex-1 max-w-sm mx-auto sm:mx-0 w-full">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <Avatar className="h-20 w-20 mb-4 border-2 border-primary/50">
                            <AvatarImage src={dev.avatar} alt={dev.name} data-ai-hint={dev.aiHint}/>
                            <AvatarFallback>{dev.initials}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold">{dev.name}</h3>
                        <Link href={dev.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-sm text-primary hover:underline">
                            Portfolio <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
