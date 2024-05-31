import { fetchAccessToken } from '@humeai/voice';
import dynamic from 'next/dynamic';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import Voice  from '@/components/Voice';

const NoOp: FC<PropsWithChildren<Record<never, never>>> = ({ children }) => (
  <>{children}</>
);

const NoSSR = dynamic(
  () => new Promise<typeof NoOp>((resolve) => resolve(NoOp)),
  { ssr: false },
);

export default function AIInterviewer1() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await fetchAccessToken({
        apiKey: '7eAHNfB5AdkI7UwR21TSOIo8fvybpNxYyuopCGfvrDANNyu1',
        clientSecret: 'R3GUZJtt4tBFCEACwFNtQ1icqhUnsZlaHlVjjOvJhL23J1js5c4NDlKX913B9Tt8',
      });
      setAccessToken(token);
    };

    fetchToken();
  }, []);

  return (
    <div className={'p-6'}>
      <h1 className={'my-4 text-lg font-medium'}>AI-Interviewer</h1>
      <NoSSR>
        {accessToken ? (
          <Voice accessToken={accessToken} />
        ) : (
          <div>Loading...</div>
        )}
      </NoSSR>
    </div>
  );
}