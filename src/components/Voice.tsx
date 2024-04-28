import { useEffect, useState } from 'react';
import { VoiceProvider } from '@humeai/voice-react';
import { ExampleComponent } from '@/components/ExampleComponent';

interface VoiceProps {
  accessToken: string;
}

const Voice = ({ accessToken }: VoiceProps) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <div>Something Happening...</div>;
  }

  return (
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
      <ExampleComponent />
    </VoiceProvider>
  );
};

export default Voice;