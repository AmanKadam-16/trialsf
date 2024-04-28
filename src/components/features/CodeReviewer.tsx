// Assuming you have a TextArea component for user input
import { useState } from 'react';
import { OpenAI } from "openai";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Badge } from "@/components/ui/badge"
import { CornerDownLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

const CodeReviewer = () => {
  const [inputText, setInputText] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const openai = new OpenAI({
    apiKey: "80bc8e21ddb6c068cb1adf347c46ee6aaa487627e2f9416ef9cd5ed81213350c",
    baseURL: "https://api.together.xyz/v1",
    dangerouslyAllowBrowser: true

  });
  console.log(generatedCode)
  const handleGenerateCode = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state

    try {
      // Send inputText to the LLM model
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an AI Code Reviewer.' },
          { role: 'user', content: inputText },
        ],
        model: 'meta-llama/Llama-3-70b-chat-hf',
        max_tokens: 1024,
      });

      // Extract the generated code from the model output
      const codeOutput = chatCompletion.choices[0].message.content;
      setGeneratedCode(codeOutput);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsLoading(false); // Reset loading state
      setInputText('')
    }
  };
  const source = generatedCode || '';
  return (
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl p-4 lg:col-span-2">
      <Badge  className="absolute right-3 top-3">
        Output
      </Badge><br />
      <div className="flex-1">
        <MarkdownPreview source={source} style={{ padding:16}}  />
      </div><br />

      <form
        className="sticky bottom-5 overflow-hidden rounded-lg border bg-opacity-75 backdrop-blur-md focus-within:ring-1 focus-within:ring-ring " x-chunk="dashboard-03-chunk-1"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <textarea
          id="message"
          placeholder="Paste you code here..." // Paste your code here
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-12 resize border-0 bg-transparent p-3 shadow-none focus:outline-none focus:border-none w-full"  // Added w-full class
        ></textarea>
        <div className="flex items-center p-3 pt-0 ">
          <Button type="submit" size="sm" className="ml-auto gap-1.5" onClick={handleGenerateCode} disabled={isLoading} >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                Review Code
                <CornerDownLeft className="size-3.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>

  );
};

export default CodeReviewer;
