import { Views } from '@/views/Views';
import { VoiceProvider } from '@humeai/voice-react';
import { AnimatePresence } from 'framer-motion';
import {  useEffect, useState } from 'react';
import '@/App.css';
import { Frame } from '../Frame';
import { fetchAccessToken } from '@humeai/voice';


function AIInterviewer() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchToken = async () => {
      const token = await fetchAccessToken({
        apiKey: 'PjvoDvF8nuoNGMmYuDixAm0sOK7EbiJGx33oH5Xx0rzlYADX',
        clientSecret: 'wJoAgmCs043gWD9EGyq83hYCl6uOvdBmg3IHms0kdQxHN3tuJJ1IszY4xk0TAtyY',
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
              messageHistoryLimit={10}
              configId="fbef1c91-dfad-4af2-ac31-8fb96622d6a8"
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
            <div>Loading...</div>
          )}
        </AnimatePresence>
      </Frame>
      
    </>
  );
}

export default AIInterviewer;
