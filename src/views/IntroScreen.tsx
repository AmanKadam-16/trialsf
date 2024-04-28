import { Button } from '@/components/Button';
import { CircledText } from '@/components/CircledText';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { useDerivedLayoutState } from '@/store/useDerivedLayoutState';

export const IntroScreen = ({
  onConnect,
  isConnecting,
}: {
  onConnect: () => void;
  isConnecting: boolean;
}) => {
  const { isShortFrame } = useDerivedLayoutState();

  return (
    <motion.div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center px-12',
        isShortFrame ? 'gap-4' : 'gap-8',
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, translateY: -4 }}
      transition={{ duration: 2 }}
    >
      <h2 className="text-center text-3xl">
        <span>Meet EVI, our </span>
        <CircledText>empathic</CircledText>
        <span> AI voice</span>
      </h2>
      <div className="w-fit">
        <motion.div
          variants={{
            initial: {
              y: '100%',
              opacity: 0,
            },
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                opacity: {
                  duration: 0.7,
                  ease: 'easeInOut',
                },
                y: {
                  duration: 1.1,
                  ease: 'easeInOut',
                },
              },
            },
            exit: {
              opacity: 0,
            },
          }}
        >
          <Button
            onClick={() => {
              onConnect();
            }}
            isLoading={isConnecting}
            loadingText={'Connecting...'}
          >
            Start Conversation
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
