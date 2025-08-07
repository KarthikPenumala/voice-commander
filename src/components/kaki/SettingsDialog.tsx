'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import type { KakiSettings } from '@/lib/types';
import { Settings, Palette, Move } from 'lucide-react';
import type { FC, Dispatch, SetStateAction } from 'react';

interface SettingsDialogProps {
  settings: KakiSettings;
  setSettings: Dispatch<SetStateAction<KakiSettings>>;
}

const colors = [
  { name: 'Default', value: 'hsl(var(--foreground))' },
  { name: 'Primary', value: 'hsl(var(--primary))' },
  { name: 'Accent', value: 'hsl(var(--accent))' },
  { name: 'Light', value: 'hsl(var(--card-foreground))' },
];

const positions: KakiSettings['position'][] = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right'
];

const SettingsDialog: FC<SettingsDialogProps> = ({ settings, setSettings }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open settings">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize Overlay</DialogTitle>
          <DialogDescription>
            Adjust the look and feel of the transcribed text overlay.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="font-size" className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" /> Font Size: {settings.fontSize.toFixed(1)}rem
            </Label>
            <Slider
              id="font-size"
              min={1}
              max={5}
              step={0.1}
              value={[settings.fontSize]}
              onValueChange={(value) => setSettings((s) => ({ ...s, fontSize: value[0] }))}
            />
          </div>
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" /> Color
            </Label>
            <RadioGroup
              value={settings.color}
              onValueChange={(value) => setSettings((s) => ({ ...s, color: value }))}
              className="grid grid-cols-2 gap-2"
            >
              {colors.map((color) => (
                <Label key={color.name} className="flex items-center gap-3 border rounded-md p-2 cursor-pointer hover:bg-accent/10 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/10">
                  <RadioGroupItem value={color.value} id={`color-${color.name}`} />
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.value }} />
                    {color.name}
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <Move className="h-4 w-4 text-muted-foreground" /> Position
            </Label>
            <RadioGroup
              value={settings.position}
              onValueChange={(value) => setSettings((s) => ({ ...s, position: value as KakiSettings['position'] }))}
              className="grid grid-cols-3 gap-2"
            >
              {positions.map((pos) => (
                <Label key={pos} className="flex items-center justify-center p-3 border rounded-md cursor-pointer hover:bg-accent/10 text-xs capitalize has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/10">
                  <RadioGroupItem value={pos} id={`pos-${pos}`} className="sr-only" />
                  {pos.replace('-', ' ')}
                </Label>
              ))}
            </RadioGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
