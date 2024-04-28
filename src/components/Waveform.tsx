import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useTheme } from './theme-provider';

type WaveformProps = {
  fft: number[];
};

export const Waveform: FC<WaveformProps> = (props) => {
  const { theme } = useTheme();

  const fillColor = theme === 'dark' ? 'white' : 'black';
  const { fft } = props;

  return (
    <motion.svg className={''} viewBox={'0 0 100 100'} width={300} height={200}>
      {Array.from({ length: 24 }).map((_, index) => {
        const value = (fft[index] ?? 0) / 4;
        const height = Math.min(Math.max(value * 80, 2), 70);
        const yOffset = 50 - height * 0.5;

        return (
          <motion.rect
            className="transition-colors"
            key={index}
            fill={fillColor}
            height={height}
            width={2}
            x={2 + (index * 100 - 4) / 24}
            y={yOffset}
          />
        );
      })}
    </motion.svg>
  );
};
