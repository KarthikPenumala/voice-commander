'use client';

import { cn } from '@/lib/utils';
import type { KakiSettings } from '@/lib/types';
import type { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface KakiOverlayProps {
  text: string;
  settings: KakiSettings;
  isTranscribing: boolean;
}

const positionClasses: Record<KakiSettings['position'], string> = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4 text-right',
  'center-left': 'top-1/2 -translate-y-1/2 left-4',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center',
  'center-right': 'top-1/2 -translate-y-1/2 right-4 text-right',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 text-center',
  'bottom-right': 'bottom-4 right-4 text-right',
};

const KakiOverlay: FC<KakiOverlayProps> = ({ text, settings, isTranscribing }) => {
  const showOverlay = isTranscribing || text;
  
  return (
    <div className={cn('fixed z-50 pointer-events-none', positionClasses[settings.position])}
      style={{
          fontSize: `${settings.fontSize}rem`,
          lineHeight: `${settings.fontSize * 1.2}rem`,
          color: settings.color,
      }}
    >
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-black/50 backdrop-blur-sm rounded-lg shadow-2xl"
          >
            {isTranscribing && !text ? 'Listening...' : text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KakiOverlay;
