import { LastVoiceMessage } from '@/components/LastVoiceMessage';
import { VoiceAnimationState } from '@/components/VoiceAnimation';
import { WaitingPrompt } from '@/components/WaitingPrompt';
import { WebGLAvatar } from '@/components/WebGLAvatar';
import { Backdrop } from '@/components/WebGLBackdrop';
import { useLayoutStore } from '@/store/layout';
import { useVoice } from '@humeai/voice-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { useDerivedLayoutState } from '@/store/useDerivedLayoutState';
import { useMemo } from 'react';



export const ConversationScreen = () => {

  const { lastVoiceMessage, isPlaying, micFft, lastUserMessage,    messages } = useVoice();
  const frameSize = useLayoutStore((store) => store.frameSize);
  const { isShortFrame } = useDerivedLayoutState();
  const assistantMessages = useMemo(() => {
    return messages
      .map((message) => {
        if (message.type === 'assistant_message') {
          return {
            message: message.message.content
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [messages]);
  return (
    <>
      <LastVoiceMessage lastVoiceMessage={lastVoiceMessage} />
      {!lastUserMessage ? <WaitingPrompt /> : null}
      <WebGLAvatar
        fft={micFft}
        isPlaying={isPlaying}
        prosody={lastVoiceMessage?.models.prosody?.scores ?? {}}
        width={400}
        height={frameSize.height - 20}
      />
      <Backdrop
        prosody={lastVoiceMessage?.models.prosody?.scores ?? {}}
        activeView={VoiceAnimationState.IDLE}
      />

                  {assistantMessages.length > 0 ? (
                      <motion.div
  
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: 'easeInOut' }}
                      className={cn(
                        'absolute mt-12 rounded-full bg-tan-200/50 px-3 py-1 gap-2 ',
                        isShortFrame ? 'mt-12' : 'mt-36',
                      )}
                    >
                      {JSON.stringify(
                        assistantMessages[assistantMessages.length - 1]?.message
                      )}
                     </motion.div>
                  ) : null}

    </>
  );
};
