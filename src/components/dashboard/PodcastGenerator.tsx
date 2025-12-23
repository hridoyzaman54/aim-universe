import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, Play, Pause, FileText, Sparkles, 
  Volume2, Download, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type StyleType = 'summary' | 'detailed' | 'genz';

interface GeneratedContent {
  podcast: string;
  transcript: string;
}

const styleDescriptions = {
  summary: 'Quick 2-minute overview of key points',
  detailed: 'In-depth explanation with examples',
  genz: 'Fun, relatable explanation with modern slang'
};

const mockContent: Record<StyleType, GeneratedContent> = {
  summary: {
    podcast: 'audio-summary',
    transcript: `📚 Quick Summary: Photosynthesis

Hey learners! Here's your quick recap:

• Plants use sunlight to make food
• They absorb CO2 and release O2
• Chlorophyll is the green pigment that makes it happen
• Water + Carbon Dioxide + Light = Glucose + Oxygen

That's photosynthesis in a nutshell! 🌱`
  },
  detailed: {
    podcast: 'audio-detailed',
    transcript: `📖 Detailed Explanation: Photosynthesis

Introduction:
Photosynthesis is the fundamental biological process that sustains life on Earth. It occurs in the chloroplasts of plant cells, specifically within structures called thylakoids.

The Process:
1. Light Absorption: Chlorophyll pigments capture light energy from the sun.
2. Water Splitting: Water molecules are split, releasing oxygen as a byproduct.
3. Carbon Fixation: CO2 from the air is converted into glucose through the Calvin Cycle.

Chemical Equation:
6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2

Key Factors:
- Light intensity affects the rate of photosynthesis
- Temperature influences enzyme activity
- CO2 concentration impacts carbon fixation

Conclusion:
This process is essential for producing oxygen and storing energy in organic compounds.`
  },
  genz: {
    podcast: 'audio-genz',
    transcript: `🔥 No Cap Photosynthesis Explanation

Yo what's good fam! Let me break down this photosynthesis thing real quick 💀

So basically plants are out here being BUILT DIFFERENT. They literally eat sunlight for breakfast, lunch, and dinner. That's lowkey iconic tbh.

Here's the tea ☕:
- Plants said "I don't need food, I AM the food" 
- They're breathing in CO2 (the stuff we breathe out) and said "I can work with this"
- Then they're out here making oxygen for us. Like thank you bestie 🙏

The chlorophyll (that green stuff) is doing ALL the heavy lifting. It's giving main character energy fr fr.

TL;DR: Plants are the real MVPs, no printer just fax 📠

And that's on period! 💅✨`
  }
};

interface PodcastGeneratorProps {
  lessonTitle?: string;
}

const PodcastGenerator: React.FC<PodcastGeneratorProps> = ({ 
  lessonTitle = 'Photosynthesis' 
}) => {
  const [selectedStyle, setSelectedStyle] = useState<StyleType>('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'podcast' | 'transcript'>('podcast');

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedContent(mockContent[selectedStyle]);
    setIsGenerating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Mic className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-display font-bold text-foreground">
          Content Generator
        </h2>
      </div>

      <Card className="p-6">
        <p className="text-sm text-muted-foreground mb-4">
          Generate audio podcast or transcript for: <span className="text-primary font-medium">{lessonTitle}</span>
        </p>

        {/* Style Selection */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(['summary', 'detailed', 'genz'] as StyleType[]).map((style) => (
            <motion.button
              key={style}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStyle(style)}
              className={`p-4 rounded-xl border text-center transition-all ${
                selectedStyle === style 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-2">
                {style === 'summary' && <FileText className="w-5 h-5 text-primary" />}
                {style === 'detailed' && <Volume2 className="w-5 h-5 text-accent" />}
                {style === 'genz' && <Sparkles className="w-5 h-5 text-energy" />}
              </div>
              <p className="font-medium text-foreground capitalize">{style === 'genz' ? 'Gen Z' : style}</p>
              <p className="text-xs text-muted-foreground mt-1">{styleDescriptions[style]}</p>
            </motion.button>
          ))}
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Content
            </>
          )}
        </Button>
      </Card>

      {generatedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'podcast' | 'transcript')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="podcast" className="gap-2">
                  <Mic className="w-4 h-4" />
                  Podcast
                </TabsTrigger>
                <TabsTrigger value="transcript" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Transcript
                </TabsTrigger>
              </TabsList>

              <TabsContent value="podcast">
                <div className="bg-secondary rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{lessonTitle}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {selectedStyle === 'genz' ? 'Gen Z' : selectedStyle} Style
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-14 h-14 rounded-full bg-primary flex items-center justify-center"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-primary-foreground" />
                      ) : (
                        <Play className="w-6 h-6 text-primary-foreground ml-1" />
                      )}
                    </motion.button>
                  </div>

                  {/* Audio Visualization */}
                  <div className="flex items-end gap-1 h-16 mb-4">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-primary/50 rounded-full"
                        animate={isPlaying ? {
                          height: [
                            Math.random() * 40 + 10,
                            Math.random() * 60 + 10,
                            Math.random() * 40 + 10
                          ]
                        } : { height: 10 }}
                        transition={{ duration: 0.3, repeat: isPlaying ? Infinity : 0, delay: i * 0.05 }}
                        style={{ height: 10 }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>0:00</span>
                    <span>{selectedStyle === 'summary' ? '2:30' : selectedStyle === 'detailed' ? '8:45' : '3:15'}</span>
                  </div>

                  <Button variant="outline" className="w-full mt-4 gap-2">
                    <Download className="w-4 h-4" />
                    Download Audio
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="transcript">
                <div className="bg-secondary rounded-xl p-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line">
                    {generatedContent.transcript}
                  </div>
                  <Button variant="outline" className="w-full mt-4 gap-2">
                    <Download className="w-4 h-4" />
                    Download Transcript
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PodcastGenerator;
