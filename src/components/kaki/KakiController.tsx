'use client';

import { transcribeVoice } from '@/ai/flows/transcribe-voice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { KakiSettings } from '@/lib/types';
import { Mic, Power, Settings as SettingsIcon, LoaderCircle } from 'lucide-react';
import type { FC, Dispatch, SetStateAction, useRef } from 'react';
import SettingsDialog from './SettingsDialog';

interface KakiControllerProps {
  isEnabled: boolean;
  setIsEnabled: Dispatch<SetStateAction<boolean>>;
  isRecording: boolean;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  isTranscribing: boolean;
  setIsTranscribing: Dispatch<SetStateAction<boolean>>;
  setTranscribedText: Dispatch<SetStateAction<string>>;
  settings: KakiSettings;
  setSettings: Dispatch<SetStateAction<KakiSettings>>;
}

const KakiController: FC<KakiControllerProps> = ({
  isEnabled,
  setIsEnabled,
  isRecording,
  setIsRecording,
  isTranscribing,
  setIsTranscribing,
  setTranscribedText,
  settings,
  setSettings,
}) => {
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          setIsTranscribing(true);
          setTranscribedText('');
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            if (!base64Audio || base64Audio === 'data:') {
              toast({ variant: 'destructive', title: 'Recording Failed', description: 'No audio was recorded.' });
              setIsTranscribing(false);
              return;
            }
            try {
              const { transcription } = await transcribeVoice({ audioDataUri: base64Audio });
              setTranscribedText(transcription);
            } catch (error) {
              console.error('Transcription error:', error);
              toast({ variant: 'destructive', title: 'Transcription Failed', description: 'Could not transcribe the audio. Please try again.' });
            } finally {
              setIsTranscribing(false);
            }
          };
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please allow microphone access in your browser settings.',
        });
      }
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardContent className="p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="kaki-power" className="flex items-center gap-2 cursor-pointer">
            <Power className="text-muted-foreground" />
            <span className="font-medium">Kaki</span>
          </Label>
          <Switch id="kaki-power" checked={isEnabled} onCheckedChange={setIsEnabled} />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isRecording ? 'destructive' : 'default'} 
            size="icon" 
            className="w-12 h-12 rounded-full"
            onClick={toggleRecording}
            disabled={!isEnabled || isTranscribing}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isTranscribing ? (
              <LoaderCircle className="h-6 w-6 animate-spin" />
            ) : (
              <Mic className={`h-6 w-6 ${isRecording ? 'animate-pulse' : ''}`} />
            )}
          </Button>
          <SettingsDialog settings={settings} setSettings={setSettings} />
        </div>
      </CardContent>
    </Card>
  );
};

export default KakiController;
