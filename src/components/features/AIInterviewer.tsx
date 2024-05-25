import { Views } from '@/views/Views';
import { VoiceProvider } from '@humeai/voice-react';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import '@/App.css';
import { Frame } from '../Frame';
import { fetchAccessToken } from '@humeai/voice';
import { cn } from '@/utils';
import { useDerivedLayoutState } from '@/store/useDerivedLayoutState';


function AIInterviewer() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { isShortFrame } = useDerivedLayoutState();
  useEffect(() => {
    const fetchToken = async () => {
      const token = await fetchAccessToken({
        apiKey: 'vnhhiAx0jg0X97bicCRrC3XqnKj2Ml6JeQD44gDDBT2is9vB',
        clientSecret: 'xCfqC7yQDQb8pOeKnJZbF4huL1PbkMBOqoXkwQZxA52p6IcYbuYPY9iIpYYtnzhg',
      });
      setAccessToken(token);
    };

    fetchToken();
  }, []);

  return (
    <>
      <Frame >
        <AnimatePresence mode={'wait'}>
          {accessToken ? (
            <VoiceProvider
              auth={{ type: 'accessToken', value: accessToken }}
              hostname={'api.hume.ai'}
              messageHistoryLimit={30}
              configId="2025ad58-d4ff-42f4-8015-c2d6d661a2e5"
              onMessage={(message) => {
                console.log('message', message);
              }}
              onClose={(event) => {
                const niceClosure = 1000;
                const code = event.code;
                if (code !== niceClosure) {
                  console.error('close event was not nice', event);
                }
              }}
            >
              <Views />
            </VoiceProvider>
          ) : (
            <div
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center px-12',
                isShortFrame ? 'gap-4' : 'gap-8',
              )}
            >
              Loading...
            </div>
          )}
        </AnimatePresence>
      </Frame>

    </>
  );
}

export default AIInterviewer;
