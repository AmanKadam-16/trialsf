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
        apiKey: 'iwgHkKQxyUQQYPAA6GAk46p7HGMfiWVe8yxXLQiL1wovS4Gv',
        clientSecret: 'rPyqyFoK1iISyMAYMwmuJERXQdRGExsR01I1DamaGhQyflPFUrIyIgcBLAjx1B8z',
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
              configId="37a70f88-c123-4053-b903-367d44a66b56"
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
