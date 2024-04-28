import { motion } from 'framer-motion';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { cva } from 'class-variance-authority';

export type FrameProps = PropsWithChildren;

const frameStyles = cva([
  'rounded-[25px]',
  'backdrop-blur-[10px]',
  'absolute bottom-0 right-0',
  'text-black',
  'antialiased',
  'transition-colors',
  'outline outline-2 -outline-offset-2 outline-white/80',
  'bg-tan-200/70', // Apply the open state background color by default
]);

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};

export const Frame: FC<FrameProps> = ({ children }) => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const frameDimensions = {
    width: `${windowDimensions.width}px`,
    height: `${windowDimensions.height}px`,
  };

  return (
    <motion.div className={`${frameStyles()} w-full h-full`}
     
      animate={frameDimensions}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      data-testid={'frame-component'}
    >
      {children}
    </motion.div>
  );
};