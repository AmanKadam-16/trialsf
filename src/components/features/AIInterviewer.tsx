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
import { Button } from '../ui/button';
//
import { OpenAI } from "openai";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { CornerDownLeft, Loader2 } from 'lucide-react';
//


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
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [generatedFeedback, setGeneratedFeedback] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchToken = async () => {
      const token = await fetchAccessToken({
        apiKey: 'iCQx5paNLBkryG37edyXnjYvN5AuXehColsLKJ7U7PANfGFb',
        clientSecret: 'RMZoEN5qiGHTDOHxTsokoShrAoKxoUDe72SBUSgpGViUALY8v3ZcPbDvaDys2zuN',
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

  const openai = new OpenAI({
    apiKey: "4dd3ec54aef08aea07c498f8c1b47627f00e9b506fa66f6b31ca4f47cceda434",
    baseURL: "https://api.together.xyz/v1",
    dangerouslyAllowBrowser: true
  });

  const handleGenerateFeedback = async () => {
    const storedChatHistory = sessionStorage.getItem('chatHistory');
    if (storedChatHistory) {
      const chatHistory: ChatEntry[] = JSON.parse(storedChatHistory);
      setIsLoading(true);
      try {
        const stream = await openai.chat.completions.create({
          messages: [
            { role: 'system', content: `
              You are an AI Interviewer providing feedback on an interview based on the interview history. Your feedback should rate the user's performance on the following metrics, using a scale of 1 to 10, and include relevant emojis:

1. 🗣️ Communication Skills: Rate the user's ability to express themselves clearly and effectively, based on their responses.
2. 🧠 Critical Thinking: Rate the user's ability to analyze information, think critically, and provide thoughtful responses.
3. 🤝 Interpersonal Skills: Rate the user's ability to build rapport, establish trust, and engage with the interviewer, based on their responses and the emotions detected.
4. 👂 Active Listening: Rate the user's ability to listen attentively and respond appropriately to the interviewer's questions and comments, based on their responses and the emotions detected.
5. 🌟 Overall Impression: Rate the user's overall performance and the impression they made during the interview, taking into account their responses and the emotions detected.

For each metric, provide a rating from 1 to 10, with 1 being the lowest and 10 being the highest. Also, include a brief explanation or justification for each rating, considering the user's responses and the emotions detected during the interview.
[Note* : Beautify the response in Markdown]
              `

             },
            { role: 'user', content: `Here is the chat history from the interview: ${JSON.stringify(chatHistory)}` },
          ],
          model: 'mistralai/Mixtral-8x22B-Instruct-v0.1',
          max_tokens: 7000,
          stream: true,
        });

        let feedback = '';
        for await (const chunk of stream) {
          const [choice] = chunk.choices;
          const { content } = choice.delta;
          const partialContent = content;
          if (partialContent) {
            feedback += partialContent;
          }
        }
        setGeneratedFeedback(feedback);
      } catch (error) {
        console.error('Error generating feedback:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Frame >
        <AnimatePresence mode={'wait'}>
          {accessToken ? (
            <VoiceProvider
              auth={{ type: 'accessToken', value: accessToken }}
              hostname={'api.hume.ai'}
              messageHistoryLimit={30}
              configId={'79673966-86c6-4b4b-94d1-31fc7b000f52'}
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
          <Button onClick={handleGenerateFeedback} className="mt-4">
          {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate Feedback <CornerDownLeft className="size-3.5" />
              </>
            )}
          </Button>
        </CardContent>
        {generatedFeedback && (
            <CardContent>
              <MarkdownPreview style={{ padding: 26, borderRadius: '5px' }} source={generatedFeedback} />
            </CardContent>
          )}
      </Card>
</div>
      {/* </motion.div> */}
    </>
  );
}

export default AIInterviewer;
