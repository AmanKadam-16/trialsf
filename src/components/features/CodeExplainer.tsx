// Assuming you have a TextArea component for user input
import { useState } from 'react';
import { OpenAI } from "openai";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Badge } from "@/components/ui/badge"
import { CornerDownLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const CodeExplainer = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: "80bc8e21ddb6c068cb1adf347c46ee6aaa487627e2f9416ef9cd5ed81213350c",
    baseURL: "https://api.together.xyz/v1",
    dangerouslyAllowBrowser: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleButtonClick = async () => {
    if (currentInput.trim() === '') {
      // If the input is empty or contains only whitespace, do nothing
      return;
    }

    setIsLoading(true);
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an AI Code Explainer.' },
          { role: 'user', content: currentInput },
        ],
        model: 'meta-llama/Llama-3-70b-chat-hf',
        max_tokens: 1024,
      });
      const codeOutput = chatCompletion.choices[0].message.content;
      setGeneratedCode(codeOutput);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsLoading(false);
      setCurrentInput('');
    }
  };

  const handleGenerateCode = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleButtonClick();
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      setCurrentInput(currentInput + '\n');
    }
  };

  const source = generatedCode || '';

  return (
    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl p-4 lg:col-span-2">
      <Badge className="absolute right-3 top-3">Output</Badge>
      <br />
      {source !== '' ? (
        <div className="flex-1">
          <MarkdownPreview source={source} style={{padding: 16}} />
        </div>
      ) : (
        <div className="flex-1"></div>
      )}
      <br />
      <form className="sticky bottom-5 overflow-hidden rounded-lg border bg-opacity-75 backdrop-blur-md focus-within:ring-1 focus-within:ring-ring ">
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <textarea
          id="message"
          placeholder="Paste you code here..."
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleGenerateCode}
          className="min-h-12 resize-vertical border-0 bg-transparent p-3 shadow-none focus:outline-none focus:border-none w-full"
        ></textarea>
        <div className="flex items-center p-3 pt-0 ">
          <Button
            type="submit"
            size="sm"
            className="ml-auto gap-1.5"
            onClick={handleButtonClick}
            disabled={isLoading || currentInput.trim() === ''}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Brainstorming...
              </>
            ) : (
              <>
                 Explain Code <CornerDownLeft className="size-3.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CodeExplainer;
