import { useState, useEffect, useRef } from 'react';
import { OpenAI } from "openai";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Badge } from "@/components/ui/badge"
import { CornerDownLeft, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { motion } from 'framer-motion';

const CodeGenerator = () => {
  const exampleMessages = [
    {
      heading: 'Create a React component for',
      subheading: 'a todo list',
      message: `Create a React component for a todo list with the following features:
- Add a new todo item
- Mark a todo item as completed
- Delete a todo item
- View both completed and pending todo items`
    },
    {
      heading: 'Write a function in JavaScript to',
      subheading: 'reverse a string',
      message: 'Write a function in JavaScript to reverse a string'
    },
    {
      heading: 'Implement a sorting algorithm in Python',
      subheading: 'like merge sort',
      message: `Implement a sorting algorithm in Python like merge sort`
    },
    {
      heading: 'Create a simple REST API in Node.js with',
      subheading: 'Express.js and MongoDB',
      message: `Create a simple REST API in Node.js with Express.js and MongoDB for managing user data with the following endpoints:
- GET /users (list all users)
- POST /users (create a new user)
- PUT /users/:id (update a user)
- DELETE /users/:id (delete a user)`
    }
  ]
  const [currentInput, setCurrentInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      return;
    }

    setIsLoading(true);
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are an AI Code Generator.' },
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

  const handlePromptClick = async (prompt: { heading?: string; subheading?: string; message: any; }) => {
    setCurrentInput(prompt.message);
    setSelectedPrompt(prompt.message);
    await handleButtonClick(); // Submit the form after setting the prompt
  };

  useEffect(() => {
    if (selectedPrompt !== '') {
      textareaRef.current?.focus();
      handleButtonClick();
    }
  }, [selectedPrompt]);

  const source = generatedCode || '';

  return (
    <div className="relative flex h-full min-h-screen flex-col rounded-xl p-4  lg:col-span-2">
      {source !== '' ? (
        <>
          <Badge className="absolute right-3 top-3">Output</Badge>
          <br />

          <div className="flex-1">
            <MarkdownPreview source={source} style={{ padding: 16 }} />
          </div>
        </>
      ) : (


        <motion.div className="flex-1 mx-auto max-w-2xl px-4" initial={{ opacity: 0 }}
          animate={{ opacity: 1, translateY: -4 }}
          transition={{ duration: 2 }}>
          <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
            <h1 className="text-5xl md:text-6xl text-center font-semibold">
              AI Code Generator
            </h1>
            {selectedPrompt === '' && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Sample Prompts</h2>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {exampleMessages.map((prompt, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-lg bg-gray-200 p-4 hover:bg-gray-300"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      <h3 className="text-lg font-semibold">
                        {prompt.heading} <span className="text-gray-600">{prompt.subheading}</span>
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>


      )}
      <br />
      <form className="sticky bottom-5 overflow-hidden rounded-lg border bg-opacity-75 backdrop-blur-md focus-within:ring-1 focus-within:ring-ring ">
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <textarea
          id="message"
          placeholder="Enter your problem statement..."
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleGenerateCode}
          ref={textareaRef}
          className="min-h-12 resize-vertical border-0 bg-transparent p-3 shadow-none focus:outline-none focus:border-none w-full"
        autoFocus></textarea>
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
                Generating...
              </>
            ) : (
              <>
                Generate Code <CornerDownLeft className="size-3.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default CodeGenerator;
