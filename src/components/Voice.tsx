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
      configId="6307ec34-eb65-4b9d-9c88-7e5b1502ca6f"
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