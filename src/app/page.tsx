'use client';

import { useState, useEffect } from 'react';
import type { KakiSettings } from '@/lib/types';
import KakiController from '@/components/kaki/KakiController';
import KakiOverlay from '@/components/kaki/KakiOverlay';
import MockBrowser from '@/components/kaki/MockBrowser';

export type Language = 'en-US' | 'te-IN';

export default function Home() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [language, setLanguage] = useState<Language>('en-US');
  const [settings, setSettings] = useState<KakiSettings>({
    fontSize: 2,
    color: 'hsl(var(--foreground))',
    position: 'bottom-center',
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (transcribedText) {
      timer = setTimeout(() => {
        setTranscribedText('');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [transcribedText]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-8 space-y-8 bg-background">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary">
          Kaki
        </h1>
        <p className="text-lg text-muted-foreground">
          Your Real-Time Voice Commander
        </p>
      </div>

      <KakiController
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        isTranscribing={isTranscribing}
        setIsTranscribing={setIsTranscribing}
        setTranscribedText={setTranscribedText}
        settings={settings}
        setSettings={setSettings}
        language={language}
        setLanguage={setLanguage}
      />
      
      <div className="w-full max-w-4xl p-4 md:p-8 rounded-xl bg-card/50">
        <MockBrowser transcribedText={transcribedText} />
      </div>

      <KakiOverlay text={transcribedText} settings={settings} isTranscribing={isTranscribing || isRecording} />

      <footer className="text-center text-sm text-muted-foreground pt-8">
        <p>Press the microphone to start and stop recording.</p>
        <p>Use the settings cog to customize the overlay.</p>
      </footer>
    </main>
  );
}
