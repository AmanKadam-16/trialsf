import React, { useEffect, useMemo, useState } from 'react';
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

type ProsodyScore = { name: string; score: string };
type ChatEntry = {
  interviewerMsg: string;
  userMsg: string;
  userEmotions: ProsodyScore[];
};

export const ConversationScreen: React.FC = () => {
  const { lastVoiceMessage, isPlaying, micFft, lastUserMessage, messages, sendUserInput } = useVoice();
  const prosody = lastUserMessage?.models.prosody?.scores ?? {};
  const sortedEmotions: ProsodyScore[] = Object.entries(prosody)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key, value]) => ({ name: key, score: value }))
    .map((entry) => ({ ...entry, score: Number(entry.score).toFixed(2) }));

  const [textValue, setTextValue] = useState('');
  const frameSize = useLayoutStore((store) => store.frameSize);
  const { isShortFrame } = useDerivedLayoutState();

  const assistantMessages = useMemo(() => {
    return messages
      .map((message) => {
        if (message.type === 'assistant_message') {
          return { message: message.message.content };
        }
        return null;
      })
      .filter((message): message is { message: string } => message !== null);
  }, [messages]);

  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [id, setId] = useState('');
  const [userMsgs, setUserMsgs] = useState('');

  useEffect(() => {
    if (lastVoiceMessage?.id !== id && lastVoiceMessage !== null && lastUserMessage !== null) {
      const currentUserMsg = lastUserMessage.message.content;
      setId(lastVoiceMessage.id);

      const newChatEntry: ChatEntry = {
        interviewerMsg: lastVoiceMessage.message.content,
        userMsg: currentUserMsg.replace(/\s+/g, '') === userMsgs ? '' : currentUserMsg,
        userEmotions: sortedEmotions,
      };

      setUserMsgs(currentUserMsg.replace(/\s+/g, ''));

      setChatHistory((prevHistory) => {
        const updatedHistory = [...prevHistory, newChatEntry];
        sessionStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    }
  }, [lastVoiceMessage, lastUserMessage, id, sortedEmotions, userMsgs]);
console.log(chatHistory)
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
      <Backdrop prosody={lastVoiceMessage?.models.prosody?.scores ?? {}} activeView={VoiceAnimationState.IDLE} />
      {assistantMessages.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className={cn('absolute mt-12 text-center rounded-full bg-tan-200/50 px-3 py-1 gap-2 ', isShortFrame ? 'mt-16' : 'mt-40')}
        >
          {JSON.stringify(assistantMessages[assistantMessages.length - 1]?.message)}
        </motion.div>
      ) : null}
      <label className="flex grow flex-col gap-2">
        <span className="sr-only">Text input content</span>
        <input
          className="border px-2 py-1"
          placeholder="Write an input message here"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
      </label>
      <button
        className="border border-black p-2"
        onClick={() => {
          sendUserInput(textValue);
        }}
      >
        Send text input message
      </button>
    </>
  );
};
