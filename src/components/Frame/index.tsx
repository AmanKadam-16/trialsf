import { motion } from 'framer-motion';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { cva } from 'class-variance-authority';

export type FrameProps = PropsWithChildren;

const frameStyles = cva([
  'rounded-[25px]',
  'backdrop-blur-[10px]',
  'text-black',
  'antialiased',
  'transition-colors',
 
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
    width: `${windowDimensions.width * 0.7}px`, // 80% of the window width
    height: `${windowDimensions.height * 0.7}px`, // 80% of the window height
  };

  return (
    <div className="flex items-center justify-center ">
      <motion.div
        className={`${frameStyles()} relative`}
        style={{ width: frameDimensions.width, height: frameDimensions.height }}
        animate={frameDimensions}
        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        data-testid={'frame-component'}
      >
        {children}
      </motion.div>
    </div>
  );
};
