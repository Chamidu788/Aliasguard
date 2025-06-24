
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Trash2, Info, Save, ShieldCheck, Check, X, Newspaper, TestTube, KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type AliasHistoryItem = {
  alias: string;
  date: string;
};

type Method = "plus" | "dot" | "random";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<Method>("plus");
  const [tag, setTag] = useState("");
  const [count, setCount] = useState(5);
  const [generatedAlias, setGeneratedAlias] = useState<string | null>(null);
  const [generatedAliases, setGeneratedAliases] = useState<string[]>([]);
  const [selectedAliases, setSelectedAliases] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<AliasHistoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
        const storedHistory = localStorage.getItem("aliasHistory");
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    } catch (error) {
        console.error("Failed to parse history from localStorage", error);
        localStorage.removeItem("aliasHistory");
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("aliasHistory", JSON.stringify(history));
    }
  }, [history, isClient]);

  const validateEmail = (email: string) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|googlemail\.com)$/i;
    return gmailRegex.test(email);
  };

  const generateRandomTag = (length = 6) => {
    return Math.random().toString(36).substring(2, 2 + length);
  };

  const generateDotVariant = (username: string) => {
    if (username.length < 2) return username;
    const chars = username.split('');
    let result = chars[0];
    for (let i = 1; i < chars.length; i++) {
      if (Math.random() > 0.5) {
        result += '.';
      }
      result += chars[i];
    }
    // ensure at least one dot is inserted if possible
    if (result === username && username.length > 1) {
        const mid = Math.floor(username.length / 2);
        if (mid > 0) {
            return username.slice(0, mid) + '.' + username.slice(mid);
        }
    }
    return result;
  };
  
  const handleGenerate = () => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid Gmail address (e.g., user@gmail.com).",
        variant: "destructive",
      });
      return;
    }

    setGeneratedAlias(null);
    setGeneratedAliases([]);
    setSelectedAliases({});

    const [username, domain] = email.split('@');

    if (method === 'plus') {
        if (!tag.trim()) {
            toast({
                title: "Missing Tag",
                description: "Please enter a tag for the '+tag' method.",
                variant: "destructive",
            });
            return;
        }
        const newAlias = `${username}+${tag.trim()}@${domain}`;
        setGeneratedAlias(newAlias);
        if (!history.some(item => item.alias === newAlias)) {
            setHistory(prev => [{ alias: newAlias, date: new Date().toISOString() }, ...prev]);
        }
        setTag("");
    } else {
        const numToGen = Math.min(50, Math.max(1, Number(count) || 1));
        const newAliases = new Set<string>();
        const attemptsLimit = numToGen * 3;
        let attempts = 0;

        while (newAliases.size < numToGen && attempts < attemptsLimit) {
            let newAlias = "";
            if (method === 'dot') {
                const dotUsername = generateDotVariant(username.replace(/\./g, ''));
                newAlias = `${dotUsername}@${domain}`;
            } else { // random
                newAlias = `${username}+${generateRandomTag()}@${domain}`;
            }
            newAliases.add(newAlias);
            attempts++;
        }
        setGeneratedAliases(Array.from(newAliases));
    }
  };
  
  const copyText = (text: string | null) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard!",
      description: `Alias has been copied.`,
    });
  };

  const clearHistory = () => {
    setHistory([]);
    toast({ title: "History Cleared", description: "Your alias history has been removed." });
  };
  
  const deleteHistoryItem = (aliasToDelete: string) => {
    setHistory(prev => prev.filter(item => item.alias !== aliasToDelete));
    toast({
      title: "Alias Removed",
      description: "The alias has been removed from your history.",
    });
  };

  const exportHistory = () => {
    if (history.length === 0) {
        toast({ title: "Nothing to Export", description: "Your alias history is empty.", variant: "destructive" });
        return;
    }
    const header = "Alias,Date Created\n";
    const csvContent = history.map(item => `"${item.alias}","${new Date(item.date).toLocaleString()}"`).join("\n");
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "aliasguard_history.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSelectionChange = (alias: string, checked: boolean | 'indeterminate') => {
    setSelectedAliases(prev => ({
        ...prev,
        [alias]: !!checked,
    }));
  };

  const getSelectedAliases = () => {
    return Object.entries(selectedAliases)
        .filter(([, isSelected]) => isSelected)
        .map(([alias]) => alias);
  }

  const saveSelectedToHistory = () => {
    const aliasesToSave = getSelectedAliases();

    if (aliasesToSave.length === 0) {
        toast({ title: "No Aliases Selected", description: "Please check the aliases you want to save.", variant: "destructive" });
        return;
    }

    const newHistoryItems = aliasesToSave
        .filter(alias => !history.some(item => item.alias === alias))
        .map(alias => ({ alias, date: new Date().toISOString() }));

    if (newHistoryItems.length > 0) {
        setHistory(prev => [...newHistoryItems, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        toast({
            title: "Saved!",
            description: `${newHistoryItems.length} new alias${newHistoryItems.length > 1 ? 'es' : ''} saved to history.`,
        });
    } else {
        toast({
            title: "Already in History",
            description: "All selected aliases are already in your history.",
        });
    }
  };

  const copySelected = () => {
      const aliasesToCopy = getSelectedAliases();

      if (aliasesToCopy.length === 0) {
          toast({ title: "No Aliases Selected", description: "Please check the aliases you want to copy.", variant: "destructive" });
          return;
      }
      
      const textToCopy = aliasesToCopy.join('\n');
      navigator.clipboard.writeText(textToCopy);
      toast({
          title: "Copied!",
          description: `${aliasesToCopy.length} alias${aliasesToCopy.length > 1 ? 'es' : ''} copied to your clipboard.`,
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <main className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create Your Secure Aliases</CardTitle>
                        <CardDescription>Generate unique aliases for your Gmail account to protect your privacy.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Your Gmail Address</Label>
                            <Input id="email" type="email" placeholder="your.name@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="method">Generation Method</Label>
                                <Select value={method} onValueChange={(value: Method) => setMethod(value)}>
                                <SelectTrigger id="method">
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="plus">+Tag (Single)</SelectItem>
                                    <SelectItem value="dot">.Dot Trick (Bulk)</SelectItem>
                                    <SelectItem value="random">Random +Tag (Bulk)</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                            {method !== 'plus' && (
                                <div className="space-y-2">
                                <Label htmlFor="count">Number to Generate</Label>
                                <Input 
                                    id="count" 
                                    type="number" 
                                    min="1" 
                                    max="50" 
                                    value={count} 
                                    onChange={e => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                                    placeholder="e.g. 5"
                                />
                                </div>
                            )}
                        </div>
                        {method === 'plus' && (
                            <div className="space-y-2">
                            <Label htmlFor="tag">Custom Tag</Label>
                            <Input id="tag" placeholder="e.g., newsletters, social" value={tag} onChange={e => setTag(e.target.value)} />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleGenerate} size="lg">
                           <ShieldCheck className="mr-2 h-4 w-4" />
                           {method === 'plus' ? 'Generate Alias' : 'Generate Aliases'}
                        </Button>
                    </CardFooter>
                </Card>

                {generatedAlias && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Your New Alias is Ready!</AlertTitle>
                      <AlertDescription>
                        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                            <code className="text-sm sm:text-base font-mono bg-muted px-2 py-1 rounded-md break-all">{generatedAlias}</code>
                            <Button variant="outline" size="sm" onClick={() => copyText(generatedAlias)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy
                            </Button>
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground">
                            <p className="font-semibold">How to use it:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>Use this alias for sign-ups to track where your emails are coming from.</li>
                                <li>All emails sent to this alias will arrive in your main inbox.</li>
                                <li>Create filters in Gmail to automatically label or archive emails from this alias.</li>
                            </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                )}
                {generatedAliases.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Generated Aliases ({generatedAliases.length})</CardTitle>
                            <CardDescription>Select the aliases you want to save or copy.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-64 pr-4">
                                <div className="space-y-3">
                                    {generatedAliases.map((alias, index) => (
                                        <div key={`${alias}-${index}`} className="flex items-center space-x-3">
                                            <Checkbox 
                                                id={`${alias}-${index}`} 
                                                checked={selectedAliases[alias] || false}
                                                onCheckedChange={(checked) => handleSelectionChange(alias, checked)}
                                            />
                                            <Label htmlFor={`${alias}-${index}`} className="font-mono text-sm break-all cursor-pointer">
                                                {alias}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <CardFooter className="flex-wrap gap-2">
                            <Button onClick={saveSelectedToHistory}>
                                <Save className="mr-2 h-4 w-4" /> Save Selected
                            </Button>
                            <Button variant="outline" onClick={copySelected}>
                                <Copy className="mr-2 h-4 w-4" /> Copy Selected
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>

            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Alias History</CardTitle>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={exportHistory} disabled={history.length === 0} aria-label="Export History">
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={clearHistory} disabled={history.length === 0} aria-label="Clear History">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <CardDescription>Your previously saved aliases.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isClient && history.length > 0 ? (
                            <ScrollArea className="h-96">
                                <div className="space-y-3 pr-2">
                                    {history.map((item) => (
                                        <div key={item.alias} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50">
                                            <span className="font-mono text-muted-foreground break-all pr-2">{item.alias}</span>
                                            <div className="flex items-center flex-shrink-0">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyText(item.alias)} aria-label="Copy alias">
                                                    <Copy className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/80 hover:text-destructive" onClick={() => deleteHistoryItem(item.alias)} aria-label="Delete alias">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="text-center text-muted-foreground text-sm py-12">
                                <p>Your history is empty.</p>
                                <p className="text-xs mt-1">Generated aliases will appear here once you save them.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>

        <section className="mt-20 py-12 border-t">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight">Fast & Secure Gmail Alias Generator</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Create unlimited Gmail aliases using your existing account—and still receive everything in your main inbox. No sign-ups. No extra inbox. Just reliable, trackable email variants for every purpose.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">✅ How It Works</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>
                            <strong>Gmail dot trick & plus aliases:</strong> Transform <code className="bg-muted px-1.5 py-0.5 rounded">yourname@gmail.com</code> into <code className="bg-muted px-1.5 py-0.5 rounded">your.name@gmail.com</code> or <code className="bg-muted px-1.5 py-0.5 rounded">yourname+shopping@gmail.com</code>.
                        </p>
                        <p>
                            <strong>Instant & disposable:</strong> Generate bespoke email aliases for registrations, newsletters, or testing—without creating new accounts.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">🔍 Why Users Search for This Tool</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-muted-foreground">
                        <p>We built our temporary email generator and email alias generator after identifying key user interests:</p>
                        <ul className="list-disc list-inside space-y-2 pt-2">
                            <li>Protect against spam and data leakage</li>
                            <li>Simplify inbox organization</li>
                            <li>Easily manage disposable, site-specific emails</li>
                        </ul>
                        <p className="pt-2"><strong>Related search terms we target:</strong></p>
                         <div className="flex flex-wrap gap-2 pt-2">
                           <Badge variant="secondary">temporary email generator</Badge>
                           <Badge variant="secondary">disposable email</Badge>
                           <Badge variant="secondary">Gmail alias generator</Badge>
                           <Badge variant="secondary">email alias creator</Badge>
                           <Badge variant="secondary">plus alias Gmail</Badge>
                           <Badge variant="secondary">Gmail dot alias tool</Badge>
                         </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="mb-12">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">🛠️ Benefits Compared to Other Methods</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Feature</TableHead>
                                    <TableHead>Our Tool</TableHead>
                                    <TableHead>Traditional Temp Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Uses your real Gmail</TableCell>
                                    <TableCell><span className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500 flex-shrink-0"/> No separate inbox needed</span></TableCell>
                                    <TableCell><span className="flex items-center gap-2"><X className="h-5 w-5 text-red-500 flex-shrink-0"/> Creates a new unknown inbox</span></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Instant alias generation</TableCell>
                                    <TableCell><span className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500 flex-shrink-0"/> No registration required</span></TableCell>
                                    <TableCell><span className="flex items-center gap-2"><X className="h-5 w-5 text-red-500 flex-shrink-0"/> Often needs sign-up</span></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Inbox forwarding intact</TableCell>
                                    <TableCell><span className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500 flex-shrink-0"/> All in your own Gmail</span></TableCell>
                                    <TableCell><span className="flex items-center gap-2"><X className="h-5 w-5 text-red-500 flex-shrink-0"/> Risk of mismanaged inbox</span></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">SEO-targeted keywords</TableCell>
                                    <TableCell><span className="flex items-center gap-2"><Check className="h-5 w-5 text-green-500 flex-shrink-0"/> Ranks for "email alias generator" etc.</span></TableCell>
                                    <TableCell><span className="flex items-center gap-2"><X className="h-5 w-5 text-red-500 flex-shrink-0"/> Doesn't apply</span></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

             <div>
                <h3 className="text-3xl font-bold text-center mb-8">🎯 Use Cases</h3>
                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <Card className="p-6">
                        <div className="flex justify-center mb-4">
                           <div className="bg-primary/10 p-3 rounded-full">
                             <KeyRound className="h-8 w-8 text-primary" />
                           </div>
                        </div>
                        <h4 className="text-xl font-semibold mb-2">Spam-free Signups</h4>
                        <p className="text-muted-foreground">Use <code className="bg-muted px-1.5 py-0.5 rounded">yourname+offer@gmail.com</code> for deals, and filter or block easily.</p>
                    </Card>
                    <Card className="p-6">
                        <div className="flex justify-center mb-4">
                           <div className="bg-primary/10 p-3 rounded-full">
                             <Newspaper className="h-8 w-8 text-primary" />
                           </div>
                        </div>
                        <h4 className="text-xl font-semibold mb-2">Newsletter Organization</h4>
                        <p className="text-muted-foreground">Create aliases like <code className="bg-muted px-1.5 py-0.5 rounded">yourname+news@gmail.com</code> for a clearer inbox structure.</p>
                    </Card>
                    <Card className="p-6">
                        <div className="flex justify-center mb-4">
                           <div className="bg-primary/10 p-3 rounded-full">
                             <TestTube className="h-8 w-8 text-primary" />
                           </div>
                        </div>
                        <h4 className="text-xl font-semibold mb-2">Testing & QA</h4>
                        <p className="text-muted-foreground">Perfect for developers needing multiple, unique test accounts without the hassle.</p>
                    </Card>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
