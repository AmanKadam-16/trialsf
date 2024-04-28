import {
  Book,
  Bot,
  BugPlay,
  Code2,
  MessageSquareCode,
  Share,
  SquareTerminal,
  Triangle,
  Moon,
   Sun
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { Button } from "./components/ui/button"
import { Card,CardContent,CardFooter,CardHeader, CardTitle} from "./components/ui/card"
import { useState } from "react"
import CodeGenerator from "./components/features/CodeGenerator"
import CodeDebugger from "./components/features/CodeDebugger"
import CodeExplainer from "./components/features/CodeExplainer"
import CodeDocumentor from "./components/features/CodeDocumentor"
import CodeReviewer from "./components/features/CodeReviewer"

// const AIInterviewer = dynamic(() => import('./components/features/AIInterviewer'), {
//   ssr: false,
// });

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import AIInterviewer from "./components/features/AIInterviewer"

const App = () => {
  const [pageCount,setPageCount] = useState("0");
  const { setTheme }  = useTheme()
  const [currentTheme,setCurrentTheme] = useState('light');

  const home = () =>{
   setPageCount("0");
  };
  const codeGen = () =>{
    setPageCount("1");
  };
  const codeDebug = () =>{
    setPageCount("2");
  };
  const codeExplain = () =>{
    setPageCount("3");
  };
  const codeDoc = () =>{
    setPageCount("4");
  };
  const codeReview =() =>{
    setPageCount("5");
  };
  const ai_Interviewer = () =>{
    setCurrentTheme('light');
    setTheme("light");
    setPageCount("6");
  };

  const copyLinkToClipboard = () => {
    const link = window.location.href; // Get the current URL
    navigator.clipboard.writeText(link)
      .then(() => console.log("Link copied to clipboard"))
      .catch((err) => console.error("Failed to copy link:", err));
  };
  const openLinkedInPost = () => {
    const linkedInPostUrl = "https://www.linkedin.com/share?url=" + encodeURIComponent(window.location.href);
    window.open(linkedInPostUrl, "_blank");
  };
  const handleShare = () => {
    copyLinkToClipboard();
    openLinkedInPost();
  };
  
  return (
    <div className="grid h-screen w-full pl-[56px]"  data-color-mode={currentTheme} >
      <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r-[1px]">
      <div className="border-b-[1px] p-2">
          <Button variant="outline" size="icon" aria-label="Home" onClick={home}>
            <Triangle className="size-5 fill-foreground" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
        <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Playground"
                onClick={codeGen}
              >
                <SquareTerminal className="size-5" />
              </Button>
              </TooltipTrigger>
        <TooltipContent side="right">
          Code Generator
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

      
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Models"
                onClick={codeDebug}
              >
                <BugPlay className="size-5"  />
             
              </Button>
              </TooltipTrigger>
        <TooltipContent side="right">
          Code Debugger
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="API"
                onClick={codeExplain}
              >
                <Code2 className="size-5" />
              </Button>
              </TooltipTrigger>
        <TooltipContent side="right">
          Code Explainer
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
       
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Documentation"
                onClick={codeDoc}
              >
                <Book className="size-5" />
              </Button>
              </TooltipTrigger>
        <TooltipContent side="right">
          Code Documentor
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Code Explainer"
                onClick={codeReview}
              >
            <MessageSquareCode className="size-5" />
              </Button>
              </TooltipTrigger>
        <TooltipContent side="right">
          Code Reviewer
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

                <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild> 
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Settings"
                onClick={ai_Interviewer}
              >
   <Bot className="size-5" />
                 </Button>
                 </TooltipTrigger>
        <TooltipContent side="right">
          AI Interviewer
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
          
              </nav>
      </aside>

      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b-[1px] bg-opacity-75 backdrop-blur-md px-4">
          <h1 className="text-xl font-semibold">AI-VERSE</h1>

          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
            onClick={handleShare}
          >
            <Share className="size-3.5" />
            Share
          </Button>
          {pageCount !=='6' &&
          <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost"  size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() =>{setTheme("light"); setCurrentTheme('light')}}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() =>{setTheme("dark"); setCurrentTheme('dark')}}>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> }
          </header>
          <main className="flex flex-1 flex-col  md:gap-8 md:p-8">
       {pageCount === "0" && 
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card x-chunk="dashboard-01-chunk-0" className="hover:bg-black hover:text-white transition-colors duration-300" onClick={codeGen} >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Code Generator
            </CardTitle>
            <SquareTerminal className="size-5" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">Supplementary Tool For code generation..</div>
          </CardContent>
          <CardFooter className="flex justify-between">
          <p className="text-xs">Great for Beginners  ★★★★</p>
    </CardFooter>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0" className="hover:bg-black hover:text-white transition-colors duration-300" onClick={codeExplain} >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Code Explainer
            </CardTitle>
            <MessageSquareCode className="size-5" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">Useful for code interpretation..</div>
          </CardContent>
          <CardFooter className="flex justify-between">
          <p className="text-xs">Great for Students  ★★★★★</p>
    </CardFooter>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0" className="hover:bg-black hover:text-white transition-colors duration-300"  onClick={codeDoc}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Code Documentation
            </CardTitle>
            <Book className="size-5" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">AI-powered code documentor..</div>
          </CardContent>
          <CardFooter className="flex justify-between">
          <p className="text-xs">Great for Developers  ★★★★</p>
    </CardFooter>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0" className="hover:bg-black hover:text-white transition-colors duration-300" onClick={codeDebug}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Code Debugger
            </CardTitle>
            <BugPlay className="size-5"  />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">Useful for debugging tricky code snippets..</div>
          </CardContent>
          <CardFooter className="flex justify-between">
          <p className="text-xs">Great for Students  ★★★</p>
    </CardFooter>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0" className="hover:bg-black hover:text-white transition-colors duration-300" onClick={codeReview}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              Code Reviewer
            </CardTitle>
            <Code2 className="size-5" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">Comprehensive code evaluation..</div>
          </CardContent>
          <CardFooter className="flex justify-between">
          <p className="text-xs">Helpful for Developers  ★★★★</p>
    </CardFooter>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0" className="hover:bg-black hover:text-white transition-colors duration-300" onClick={ai_Interviewer}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              AI-Interviewer
            </CardTitle>
            <Bot className="size-5" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">Your personal mock-interviewer..</div>
          </CardContent>
          <CardFooter className="flex justify-between">
          <p className="text-xs">Great for Freshers & Students  ★★★★★</p>
    </CardFooter>
        </Card>
        </div>}
      

        {
          pageCount === "1" &&
          <CodeGenerator />
        }
        {
          pageCount === "2" &&
          <CodeDebugger />
        }
        {
          pageCount === "3" &&
          <CodeExplainer />
        }
        {
          pageCount === "4" &&
          <CodeDocumentor />
        }
        {
          pageCount === "5" && 
          <CodeReviewer />
        }
     
   
   {
          pageCount === "6" && 
          <AIInterviewer />
        }
        
          </main>
          </div>
    </div>

  )
}
export default App;