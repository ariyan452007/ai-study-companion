import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Send, Copy, CheckCircle2, FileText, Brain, MessageSquare } from 'lucide-react';
import { useData } from '@/context/DataContext';



export const AITools = () => {
  const { topics } = useData();
  const [activeTool, setActiveTool] = useState('Summary');
  const [inputText, setInputText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Load topic notes into input when a topic is selected
  const handleTopicSelect = (e) => {
    const topicId = e.target.value;
    setSelectedTopic(topicId);
    const topic = topics.find((t) => t.id === topicId);
    if (topic && topic.notes) {
      setInputText(topic.notes);
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    setResult(null);
    setCopied(false);

    try {
      // Import the AI utilities dynamically or statically
      // We will statically import them at the top of the file
      const { generateAIContent, buildPrompt } = await import('@/lib/ai');

      const prompt = buildPrompt(activeTool, inputText);
      const aiResponse = await generateAIContent(prompt);

      setResult(aiResponse);
    } catch (error) {
      console.error(error);
      setResult(`Error: ${error.message}\n\nPlease ensure you have added your VITE_GEMINI_API_KEY to your .env file.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tools = [
  { id: 'Summary', name: 'Summarize', icon: FileText, description: 'Condense long notes into key points.' },
  { id: 'Flashcards', name: 'Flashcards', icon: Brain, description: 'Create Q&A pairs for active recall.' },
  { id: 'Questions', name: 'Practice Qs', icon: MessageSquare, description: 'Generate test questions to check understanding.' }];


  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AI Study Assistant</h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Leverage AI to generate summaries, flashcards, and practice questions from your notes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Select Tool</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                    isActive ?
                    'border-primary bg-primary/5 shadow-sm' :
                    'border-transparent hover:bg-muted'}`
                    }>
                    
                    <Icon className={`h-5 w-5 mt-0.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <div className={`font-medium text-sm ${isActive ? 'text-primary' : ''}`}>
                        {tool.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {tool.description}
                      </div>
                    </div>
                  </button>);

              })}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <Card className="flex flex-col h-full min-h-[500px]">
            <CardHeader className="border-b pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  {(() => {
                    const ActiveIcon = tools.find((t) => t.id === activeTool)?.icon;
                    return ActiveIcon ? <ActiveIcon className="h-5 w-5 text-primary" /> : null;
                  })()}
                  {activeTool} Generator
                </CardTitle>
                <Badge variant="secondary" className="font-normal text-xs bg-primary/10 text-primary">
                  Powered by AI
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 flex flex-col">
              <div className="p-4 border-b bg-muted/30">
                <div className="space-y-3">
                  {topics.length > 0 &&
                  <div className="space-y-1.5">
                      <Label htmlFor="topic-select" className="text-xs text-muted-foreground uppercase tracking-wider">
                        Load from Topic (Optional)
                      </Label>
                      <select
                      id="topic-select"
                      value={selectedTopic}
                      onChange={handleTopicSelect}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      
                        <option value="">Select a topic...</option>
                        {topics.map((t) =>
                      <option key={t.id} value={t.id}>{t.name}</option>
                      )}
                      </select>
                    </div>
                  }
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="content" className="text-xs text-muted-foreground uppercase tracking-wider">
                      Content to analyze
                    </Label>
                    <textarea
                      id="content"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste your notes, article, or text here..."
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y" />
                    
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !inputText.trim()}
                      className="gap-2">
                      
                      {isGenerating ?
                      <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Generating...
                        </> :

                      <>
                          <Send className="h-4 w-4" />
                          Generate {activeTool}
                        </>
                      }
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6 relative bg-card">
                {result ?
                <div className="h-full flex flex-col animate-in fade-in">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                        Result
                      </h3>
                      <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={handleCopy}>
                        {copied ?
                      <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Copied</> :

                      <><Copy className="h-3.5 w-3.5" /> Copy</>
                      }
                      </Button>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed p-4 bg-muted/30 rounded-lg border flex-1 overflow-y-auto">
                      {result}
                    </div>
                  </div> :

                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
                    <Sparkles className="h-12 w-12 mb-3 stroke-1" />
                    <p className="text-sm">Provide content and click generate to see AI output.</p>
                  </div>
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

};