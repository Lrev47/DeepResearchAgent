'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Brain,
  Search,
  FileText,
  ExternalLink,
  Clock,
  Target,
  BookOpen,
  Zap,
  Send,
  Loader2,
  Globe,
  GraduationCap,
  Microscope,
  Download,
  Code,
  Copy,
  FileDown,
  Database,
  Sparkles,
  Rocket,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface ResearchStep {
  stepNumber: number;
  query: string;
  rationale: string;
  sources: string[];
  keyFindings: string[];
  questionsRaised: string[];
}

interface ResearchReport {
  id: string;
  query: {
    originalQuery: string;
    depth: string;
  };
  executiveSummary: string;
  keyFindings: string[];
  methodology: string;
  limitations: string[];
  recommendations: string[];
  confidence: number;
  estimatedReadTime: number;
  researchSteps: ResearchStep[];
  sources: any[];
  createdAt: Date;
}

interface DeepResearchResponse {
  success: boolean;
  reportId: string;
  report?: ResearchReport;
  notionPageId?: string;
  estimatedTime?: number;
  error?: string;
}

export function DeepResearchInterface() {
  const [query, setQuery] = useState('');
  const [depth, setDepth] = useState<'quick' | 'standard' | 'comprehensive'>('comprehensive');
  const [deliverToNotion, setDeliverToNotion] = useState(true);
  const [isResearching, setIsResearching] = useState(false);
  const [currentReport, setCurrentReport] = useState<ResearchReport | null>(null);
  const [researchProgress, setResearchProgress] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [notionPageId, setNotionPageId] = useState<string>('');

  const handleDeepResearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a research question');
      return;
    }

    setIsResearching(true);
    setResearchProgress([]);
    setCurrentReport(null);
    setCurrentStep('');
    setNotionPageId('');

    const progressMessages = [
      '🔍 Analyzing research question complexity and scope...',
      '📋 Generating comprehensive multi-step research plan...',
      '🌐 Searching web sources for current information...',
      '🎓 Querying academic databases (arXiv, Google Scholar)...',
      '🔬 Analyzing initial findings and identifying knowledge gaps...',
      '🔄 Conducting follow-up research based on preliminary findings...',
      '📊 Cross-referencing sources and validating information...',
      '📝 Synthesizing comprehensive research report...',
      '✅ Finalizing professional research documentation...'
    ];

    let messageIndex = 0;
    const progressInterval = setInterval(() => {
      if (messageIndex < progressMessages.length) {
        setResearchProgress(prev => [...prev, progressMessages[messageIndex]]);
        setCurrentStep(progressMessages[messageIndex]);
        messageIndex++;
      }
    }, 3000);

    try {
      console.log('🚀 Starting real deep research via API...');
      
      const response = await fetch('/api/research/deep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          depth,
          deliverToNotion,
          focusAreas: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DeepResearchResponse = await response.json();

      clearInterval(progressInterval);
      setResearchProgress(prev => [...prev, '✅ Deep research completed successfully!']);
      setCurrentStep('');

      if (data.success && data.report) {
        setCurrentReport(data.report);
        if (data.notionPageId) {
          setNotionPageId(data.notionPageId);
        }
        toast.success(
          deliverToNotion && data.notionPageId
            ? 'Deep research completed and delivered to Notion!' 
            : 'Deep research completed successfully!'
        );
      } else {
        throw new Error(data.error || 'Research failed');
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      setResearchProgress(prev => [...prev, '❌ Research failed']);
      setCurrentStep('');
      toast.error(`Research failed: ${error.message}`);
      console.error('Deep research error:', error);
    } finally {
      setIsResearching(false);
    }
  };

  const generateMarkdown = (report: ResearchReport): string => {
    const date = new Date(report.createdAt).toLocaleDateString();
    
    return `# Research Report: ${report.query.originalQuery}

**Generated:** ${date}  
**Research Depth:** ${report.query.depth}  
**Confidence Level:** ${Math.round(report.confidence * 100)}%  
**Estimated Read Time:** ${report.estimatedReadTime} minutes  
**Report ID:** ${report.id}

---

## Executive Summary

${report.executiveSummary}

---

## Key Findings

${(report.keyFindings || []).map((finding, index) => `${index + 1}. ${finding}`).join('\n\n')}

---

## Research Process

This research was conducted through ${report.researchSteps?.length || 0} systematic steps:

${(report.researchSteps || []).map(step => `
### Step ${step.stepNumber}: ${step.query}

**Rationale:** ${step.rationale}

**Key Findings:**
${(step.keyFindings || []).map(finding => `- ${finding}`).join('\n')}

**Sources Used:** ${(step.sources || []).join(', ')}

${step.questionsRaised?.length > 0 ? `**Questions Raised:**\n${step.questionsRaised.map(q => `- ${q}`).join('\n')}` : ''}
`).join('\n')}

---

## Methodology

${report.methodology}

${(report.limitations || []).length > 0 ? `
### Research Limitations

${report.limitations.map(limitation => `- ${limitation}`).join('\n')}
` : ''}

---

## Recommendations & Next Steps

${(report.recommendations || []).map((rec, index) => `${index + 1}. ${rec}`).join('\n\n')}

---

## Sources

${(report.sources || []).map((source, index) => `${index + 1}. [${source.title}](${source.url}) - *${source.source}*`).join('\n')}

---

*This report was generated by ResearchFlow, developed by AISynthLab LLC and powered by CompanyFactory. Our AI-powered research platform leverages multiple search engines, document analysis, and intelligent agents to deliver comprehensive research reports.*`;
  };

  const downloadAsPDF = async () => {
    if (!currentReport) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = 7;
      let yPosition = margin;

      const addText = (text: string, fontSize = 10, isBold = false) => {
        pdf.setFontSize(fontSize);
        if (isBold) pdf.setFont('helvetica', 'bold');
        else pdf.setFont('helvetica', 'normal');
        
        const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
        
        for (const line of lines) {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        }
        yPosition += 3;
      };

      addText(`Research Report: ${currentReport.query.originalQuery}`, 16, true);
      yPosition += 5;

      addText(`Generated: ${new Date(currentReport.createdAt).toLocaleDateString()}`, 9);
      addText(`Research Depth: ${currentReport.query.depth}`, 9);
      addText(`Confidence Level: ${Math.round(currentReport.confidence * 100)}%`, 9);
      addText(`Estimated Read Time: ${currentReport.estimatedReadTime} minutes`, 9);
      yPosition += 5;

      addText('Executive Summary', 14, true);
      addText(currentReport.executiveSummary);
      yPosition += 5;

      addText('Key Findings', 14, true);
      (currentReport.keyFindings || []).forEach((finding, index) => {
        addText(`${index + 1}. ${finding}`);
      });
      yPosition += 5;

      addText('Methodology', 14, true);
      addText(currentReport.methodology);
      yPosition += 5;

      addText('Recommendations & Next Steps', 14, true);
      (currentReport.recommendations || []).forEach((rec, index) => {
        addText(`${index + 1}. ${rec}`);
      });

      const fileName = `research-report-${currentReport.id}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const copyMarkdownToClipboard = async () => {
    if (!currentReport) return;

    try {
      const markdown = generateMarkdown(currentReport);
      await navigator.clipboard.writeText(markdown);
      toast.success('Markdown copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadMarkdown = () => {
    if (!currentReport) return;

    const markdown = generateMarkdown(currentReport);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-report-${currentReport.id}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Markdown file downloaded!');
  };

  const getSourceIcon = (source: string) => {
    if (!source) return <FileText className="h-4 w-4" />;
    
    switch (source.toLowerCase()) {
      case 'arxiv': return <GraduationCap className="h-4 w-4" />;
      case 'google_scholar': return <Microscope className="h-4 w-4" />;
      case 'web': return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Hero Header */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl float">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary blur-lg opacity-50 -z-10" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text text-center sm:text-left">
                Deep Research Agent
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Next-generation AI research platform with deep investigation capabilities, 
              multi-source analysis, and automated report generation.
            </p>
          </div>
        </div>

        {/* Research Configuration */}
        <Card className="modern-card glow-primary">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xl sm:text-2xl text-center sm:text-left">
              <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="gradient-text">Research Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <label className="text-base sm:text-lg font-semibold text-foreground">Research Question *</label>
              <Input
                placeholder="e.g., What are the latest developments in quantum computing for AI applications?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isResearching}
                className="input-modern text-base sm:text-lg py-3 sm:py-4"
              />
            </div>

            <div className="space-y-4">
              <label className="text-base sm:text-lg font-semibold text-foreground">Research Depth</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { value: 'quick', label: 'Quick', desc: '3-4 steps, ~10 min', icon: Zap, color: 'text-yellow-500' },
                  { value: 'standard', label: 'Standard', desc: '4-6 steps, ~15 min', icon: Target, color: 'text-blue-500' },
                  { value: 'comprehensive', label: 'Comprehensive', desc: '6-8 steps, ~25 min', icon: Brain, color: 'text-purple-500' }
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <Card 
                      key={option.value}
                      className={`modern-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                        depth === option.value 
                          ? 'ring-2 ring-primary glow-primary' 
                          : 'hover:glow-secondary'
                      }`}
                      onClick={() => setDepth(option.value as any)}
                    >
                      <CardContent className="p-4 sm:p-6 text-center">
                        <Icon className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 ${option.color}`} />
                        <div className="text-lg sm:text-xl font-semibold mb-1">{option.label}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{option.desc}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 sm:p-4 glass rounded-xl">
              <input
                type="checkbox"
                id="notion"
                checked={deliverToNotion}
                onChange={(e) => setDeliverToNotion(e.target.checked)}
                disabled={isResearching}
                className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
              />
              <label htmlFor="notion" className="text-sm sm:text-lg font-medium cursor-pointer">
                Automatically deliver comprehensive report to Notion workspace
              </label>
            </div>

            <Button
              onClick={handleDeepResearch}
              disabled={isResearching || !query.trim()}
              className="btn-primary w-full py-3 sm:py-4 text-base sm:text-lg pulse-glow"
              size="lg"
            >
              {isResearching ? (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 animate-spin" />
                  Conducting Deep Research...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  Start Deep Research ({depth})
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Research Progress */}
        {isResearching && (
          <Card className="modern-card gradient-bg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-lg sm:text-xl">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
                Research Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentStep && (
                  <div className="glass p-3 sm:p-4 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 sm:gap-3 text-white font-medium text-sm sm:text-base">
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span>Current: {currentStep}</span>
                    </div>
                  </div>
                )}
                <div className="space-y-2 sm:space-y-3">
                  {researchProgress.map((message, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-3 text-white/90 text-sm sm:text-base">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        (message || '').includes('✅') ? 'bg-green-400' :
                        (message || '').includes('❌') ? 'bg-red-400' : 'bg-cyan-400'
                      }`}></div>
                      {message}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Research Results */}
        {currentReport && (
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  <span className="gradient-text text-lg sm:text-2xl">Research Report</span>
                </div>
                
                {/* Export Options */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {/* Markdown Dialog */}
                  <Dialog open={showMarkdown} onOpenChange={setShowMarkdown}>
                    <DialogTrigger asChild>
                      <Button className="btn-secondary text-xs sm:text-sm">
                        <Code className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View </span>Markdown
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[80vh] overflow-y-auto modern-card mx-2">
                      <DialogHeader>
                        <DialogTitle className="gradient-text text-lg sm:text-xl">Research Report - Markdown Code</DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                          Copy this markdown code or download it as a .md file
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Button onClick={copyMarkdownToClipboard} className="btn-primary text-sm">
                            <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Copy to Clipboard
                          </Button>
                          <Button onClick={downloadMarkdown} className="btn-secondary text-sm">
                            <FileDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Download .md
                          </Button>
                        </div>
                        <div className="bg-gray-900 text-green-400 p-3 sm:p-6 rounded-xl overflow-x-auto">
                          <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap">
                            {generateMarkdown(currentReport)}
                          </pre>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* PDF Download */}
                  <Button onClick={downloadAsPDF} className="btn-secondary text-xs sm:text-sm">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Download </span>PDF
                  </Button>

                  {/* Notion Link */}
                  {notionPageId && (
                    <Button 
                      asChild 
                      className="btn-secondary text-xs sm:text-sm"
                    >
                      <a 
                        href={`https://notion.so/${notionPageId.replace(/-/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Database className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">View in </span>Notion
                      </a>
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 glass rounded-xl p-1">
                  <TabsTrigger value="summary" className="rounded-lg text-xs sm:text-sm">Summary</TabsTrigger>
                  <TabsTrigger value="findings" className="rounded-lg text-xs sm:text-sm">Findings</TabsTrigger>
                  <TabsTrigger value="steps" className="rounded-lg text-xs sm:text-sm hidden sm:block">Steps</TabsTrigger>
                  <TabsTrigger value="methodology" className="rounded-lg text-xs sm:text-sm hidden sm:block">Method</TabsTrigger>
                  <TabsTrigger value="recommendations" className="rounded-lg text-xs sm:text-sm">Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="text-center p-3 sm:p-4 glass rounded-xl glow-primary">
                      <Target className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-primary" />
                      <div className="text-xl sm:text-3xl font-bold text-primary">{Math.round(currentReport.confidence * 100)}%</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Confidence</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 glass rounded-xl glow-secondary">
                      <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-secondary" />
                      <div className="text-xl sm:text-3xl font-bold text-secondary">{currentReport.researchSteps?.length || 0}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Research Steps</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 glass rounded-xl">
                      <ExternalLink className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-purple-400" />
                      <div className="text-xl sm:text-3xl font-bold text-purple-400">{currentReport.sources?.length || 0}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Sources</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 glass rounded-xl">
                      <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-orange-400" />
                      <div className="text-xl sm:text-3xl font-bold text-orange-400">{currentReport.estimatedReadTime}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Min Read</div>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4 sm:p-6">
                    <h3 className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-4 gradient-text">Executive Summary</h3>
                    <div className="prose prose-sm sm:prose-lg max-w-none text-foreground">
                      <p className="leading-relaxed text-sm sm:text-base">
                        {currentReport.executiveSummary}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="findings" className="space-y-4 mt-4 sm:mt-6">
                  <h3 className="text-lg sm:text-2xl font-semibold gradient-text">Key Research Findings</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {currentReport.keyFindings?.map((finding, index) => (
                      <div key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 glass rounded-xl hover:glow-primary transition-all">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <span className="text-foreground leading-relaxed text-sm sm:text-base">{finding}</span>
                      </div>
                    )) || <p className="text-muted-foreground italic">No findings available yet.</p>}
                  </div>
                </TabsContent>

                <TabsContent value="steps" className="space-y-4 mt-4 sm:mt-6">
                  <h3 className="text-lg sm:text-2xl font-semibold gradient-text">Research Process</h3>
                  <div className="space-y-4 sm:space-y-6">
                    {currentReport.researchSteps?.map((step, index) => (
                      <Card key={index} className="modern-card border-l-4 border-l-primary">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm sm:text-lg font-bold flex-shrink-0">
                              {step.stepNumber}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                                {step.query}
                              </h4>
                              <p className="text-muted-foreground mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                                {step.rationale}
                              </p>
                              
                              {step.keyFindings?.length > 0 && (
                                <div className="mb-3 sm:mb-4">
                                  <h5 className="font-medium mb-2 text-primary text-sm sm:text-base">Key Findings:</h5>
                                  <ul className="text-foreground space-y-1 sm:space-y-2">
                                    {step.keyFindings?.map((finding, idx) => (
                                      <li key={idx} className="flex gap-2 text-sm sm:text-base">
                                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-secondary mt-0.5 flex-shrink-0" />
                                        {finding}
                                      </li>
                                    )) || []}
                                  </ul>
                                </div>
                              )}
                              
                              <div className="flex gap-2 flex-wrap">
                                {(step.sources || []).map((source, idx) => (
                                  <div key={idx} className="flex items-center gap-1 text-xs glass px-2 sm:px-3 py-1 rounded-full">
                                    {getSourceIcon(source)}
                                    <span className="text-xs sm:text-sm">{source || 'Unknown'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) || (
                      <p className="text-muted-foreground italic text-sm sm:text-base">Research steps will be displayed here after research completion.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="methodology" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                  <h3 className="text-lg sm:text-2xl font-semibold gradient-text">Research Methodology</h3>
                  <div className="glass rounded-xl p-4 sm:p-6">
                    <p className="text-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                      {currentReport.methodology}
                    </p>
                    
                    {currentReport.limitations?.length > 0 && (
                      <div>
                        <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-orange-400">Research Limitations</h4>
                        <ul className="space-y-2 sm:space-y-3">
                          {(currentReport.limitations || []).map((limitation, index) => (
                            <li key={index} className="flex gap-2 sm:gap-3 text-foreground text-sm sm:text-base">
                              <span className="text-orange-400 mt-1">⚠</span>
                              {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4 mt-4 sm:mt-6">
                  <h3 className="text-lg sm:text-2xl font-semibold gradient-text">Recommendations & Next Steps</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {(currentReport.recommendations || []).map((recommendation, index) => (
                      <div key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 glass rounded-xl hover:glow-secondary transition-all">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-secondary text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <span className="text-foreground leading-relaxed text-sm sm:text-base">{recommendation}</span>
                      </div>
                    ))}
                    {(!currentReport.recommendations || currentReport.recommendations.length === 0) && (
                      <p className="text-muted-foreground italic text-sm sm:text-base">No recommendations available yet.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="modern-card hover:glow-primary transition-all">
            <CardContent className="p-6 sm:p-8 text-center">
              <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-primary" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 gradient-text">Multi-Source Research</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Searches academic papers (arXiv, PubMed), scholarly articles (Google Scholar), and current web sources
              </p>
            </CardContent>
          </Card>

          <Card className="modern-card hover:glow-secondary transition-all">
            <CardContent className="p-6 sm:p-8 text-center">
              <Zap className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-secondary" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 gradient-text">Iterative Analysis</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Conducts follow-up research based on initial findings, just like ChatGPT&apos;s Deep Research
              </p>
            </CardContent>
          </Card>

          <Card className="modern-card hover:glow-primary transition-all md:col-span-1">
            <CardContent className="p-6 sm:p-8 text-center">
              <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-purple-400" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 gradient-text">Professional Reports</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Generates comprehensive reports with citations and automatically delivers to Notion
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 