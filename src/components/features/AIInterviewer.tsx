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
        apiKey: 'jVCep26JGYGqKbQbhJJPuqemD8IpiFRrZWR81rOHRBoQN2Xl',
        clientSecret: 'PVC3YRZ7jk7qbCFk25pjSja81rpCzowb29ycm4nCGGA4ebjmB3A8urMvIXROD10y',
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
              configId="dede3074-f41a-4d20-8ab4-213d2ea7047e"
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
