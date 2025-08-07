import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { FC } from 'react';

interface MockBrowserProps {
  transcribedText: string;
}

const MockBrowser: FC<MockBrowserProps> = ({ transcribedText }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl overflow-hidden border-2 border-slate-700/20 dark:border-slate-700/50 bg-card">
      <CardHeader className="bg-muted/50 p-2 flex flex-row items-center gap-2 border-b">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="bg-background rounded-md flex-1 px-2 py-1 text-sm text-center text-muted-foreground">
          kaki-search.com
        </div>
      </CardHeader>
      <CardContent className="p-8 md:p-16">
        <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-center mb-8 text-muted-foreground/80 font-headline">
              Kaki Search
            </h1>
        </div>
        <div className="relative w-full max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search with Kaki or type a URL"
            className="w-full rounded-full py-6 pl-12 pr-4 shadow-inner text-base"
            value={transcribedText}
            readOnly
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MockBrowser;
