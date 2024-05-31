import { Views } from '@/views/Views';
import { VoiceProvider } from '@humeai/voice-react';
import { AnimatePresence} from 'framer-motion';
import { useEffect, useState } from 'react';
import '@/App.css';
import { Frame } from '../Frame';
import { fetchAccessToken } from '@humeai/voice';
import { cn } from '@/utils';
import { useDerivedLayoutState } from '@/store/useDerivedLayoutState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

type ProsodyScore = { name: string; score: string };
type ChatEntry = {
  interviewerMsg: string;
  userMsg: string;
  userEmotions: ProsodyScore[];
};

type EmotionStats = {
  averageScores: { name: string; score: number }[];
  peakScores: { name: string; score: number }[];
};

const calculateEmotionStats = (chatHistory: ChatEntry[]): EmotionStats => {
  const emotionMap: Record<string, { total: number; count: number; max: number }> = {};

  chatHistory.forEach((entry) => {
    entry.userEmotions.forEach((emotion) => {
      if (!emotionMap[emotion.name]) {
        emotionMap[emotion.name] = { total: 0, count: 0, max: 0 };
      }
      const score = parseFloat(emotion.score);
      emotionMap[emotion.name].total += score;
      emotionMap[emotion.name].count += 1;
      if (score > emotionMap[emotion.name].max) {
        emotionMap[emotion.name].max = score;
      }
    });
  });

  const averageScores: { name: string; score: number }[] = [];
  const peakScores: { name: string; score: number }[] = [];

  for (const [name, data] of Object.entries(emotionMap)) {
    averageScores.push({ name, score: parseFloat((data.total / data.count).toFixed(2)) });
    peakScores.push({ name, score: parseFloat(data.max.toFixed(2)) });
  }

  averageScores.sort((a, b) => b.score - a.score);
  const top3AverageScores = averageScores.slice(0, 6);
  const top3PeakScores = peakScores
    .filter((peakScore) => top3AverageScores.find((avgScore) => avgScore.name === peakScore.name))
    .sort((a, b) => b.score - a.score);

  return { averageScores: top3AverageScores, peakScores: top3PeakScores };
};

type ChartData = {
  name: string;
  average: number;
  peak: number;
};

function AIInterviewer() {
  // const chartdatas = [
  //   { name: 'Relief', average: 0.41, peak: 0.78 },
  //   { name: 'Appreciation', average: 0.43, peak: 0.19 },
  //   { name: 'Enthusiasm', average: 0.5, peak: 0.63 },
  //   { name: 'Sarcasm', average: 0.35, peak: 0.87 },
  //   { name: 'Empathic Pain', average: 0.46, peak: 0.68 },
  //   { name: 'Craving', average: 0.38, peak: 0.54 },
  //   { name: 'Calmness', average: 0.72, peak: 0.71 },
  //   { name: 'Sympathy', average: 0.13, peak: 0.55 },
  //   { name: 'Contemplation', average: 0.63, peak: 0.49 },
  //   { name: 'Fear', average: 0.16, peak: 0.34 },
  // ]
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { isShortFrame } = useDerivedLayoutState();
  const [chartData, setChartData] = useState<ChartData[]>([]);
 
  useEffect(() => {
    const fetchToken = async () => {
      const token = await fetchAccessToken({
        apiKey: '7eAHNfB5AdkI7UwR21TSOIo8fvybpNxYyuopCGfvrDANNyu1',
        clientSecret: 'R3GUZJtt4tBFCEACwFNtQ1icqhUnsZlaHlVjjOvJhL23J1js5c4NDlKX913B9Tt8',
      });
      
      setAccessToken(token);
    };

    fetchToken();
  }, [])
console.log(chartData)

  useEffect(() => {
    const storedChatHistory = sessionStorage.getItem('chatHistory');
  if (storedChatHistory) {
    const chatHistory: ChatEntry[] = JSON.parse(storedChatHistory);
    const { averageScores, peakScores } = calculateEmotionStats(chatHistory);
    const chartData = averageScores.map((avgScore, index) => ({
      name: avgScore.name,
      average: avgScore.score,
      peak: peakScores[index].score,
    }));
    setChartData(chartData);
}
  });

  return (
    <>
      <Frame >
        <AnimatePresence mode={'wait'}>
          {accessToken ? (
            <VoiceProvider
              auth={{ type: 'accessToken', value: accessToken }}
              hostname={'api.hume.ai'}
              messageHistoryLimit={30}
              configId={'6307ec34-eb65-4b9d-9c88-7e5b1502ca6f'}
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
      <br /><br />
      {/* <motion.div className="sm: px-4 sm: py-4  " 
                        initial={{ opacity: 0 }}
          animate={{ opacity: 1, translateY: -4 }}
          transition={{ duration: 2 }}> */}
<div  className="sm: px-4 sm: py-4 ">
<Card>
        <CardHeader>
          <CardTitle>Emotion Analysis</CardTitle>
          <CardDescription>Average and Peak Emotion Scores</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="average" stroke="#615EFC" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="peak" stroke="#FF0000" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
</div>
      {/* </motion.div> */}
    </>
  );
}

export default AIInterviewer;
