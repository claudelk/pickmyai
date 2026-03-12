export interface Platform {
  id: string
  displayName: string
  company: string
  model: string
  freeModel: boolean
  color: string
  pricingUrl: string
  signupUrl: string
  tagline: string
  strengths: string[]
  bestForIndividual: string
  bestForBusiness: string
}

export const PLATFORMS: Platform[] = [
  {
    id: "chatgpt",
    displayName: "ChatGPT",
    company: "OpenAI",
    model: "gpt-4o-mini",
    freeModel: true,
    color: "#10A37F",
    pricingUrl: "https://openai.com/chatgpt/pricing",
    signupUrl: "https://chat.openai.com",
    tagline: "The versatile generalist",
    strengths: ["Everyday tasks", "Summarizing", "Conversation"],
    bestForIndividual: "Great starting point for almost anything",
    bestForBusiness: "Customer-facing chatbots and content generation at scale",
  },
  {
    id: "claude",
    displayName: "Claude",
    company: "Anthropic",
    model: "claude-haiku-4-5",
    freeModel: true,
    color: "#CC785C",
    pricingUrl: "https://www.anthropic.com/pricing",
    signupUrl: "https://claude.ai",
    tagline: "The careful reasoner",
    strengths: ["Long-form writing", "Nuanced reasoning", "Sensitive topics"],
    bestForIndividual: "When tone, nuance, and getting it right matters",
    bestForBusiness: "Research, analysis, and complex document work",
  },
  {
    id: "gemini",
    displayName: "Gemini",
    company: "Google",
    model: "gemini-1.5-flash",
    freeModel: true,
    color: "#1A73E8",
    pricingUrl: "https://ai.google.dev/pricing",
    signupUrl: "https://gemini.google.com",
    tagline: "The visual thinker",
    strengths: ["Images and visuals", "Google Workspace", "Multimodal tasks"],
    bestForIndividual: "If you already live in Google Docs and Gmail",
    bestForBusiness: "Teams working with visual content and Google Workspace",
  },
  {
    id: "mistral",
    displayName: "Mistral",
    company: "Mistral AI",
    model: "mistral-small-latest",
    freeModel: true,
    color: "#FF7000",
    pricingUrl: "https://mistral.ai/pricing",
    signupUrl: "https://chat.mistral.ai",
    tagline: "The efficient specialist",
    strengths: ["Speed", "Privacy-friendly", "European data compliance"],
    bestForIndividual: "Fast answers, privacy-conscious users",
    bestForBusiness: "European businesses, developers, compliance-sensitive orgs",
  },
  {
    id: "grok",
    displayName: "Grok",
    company: "xAI",
    model: "grok-2-latest",
    freeModel: true,
    color: "#000000",
    pricingUrl: "https://x.ai/api",
    signupUrl: "https://grok.x.ai",
    tagline: "The news junkie",
    strengths: ["Real-time web access", "Current events", "Informal tone"],
    bestForIndividual: "Staying on top of news and fast-moving topics",
    bestForBusiness: "Social media monitoring and trend research",
  },
  {
    id: "meta",
    displayName: "Meta AI",
    company: "Meta",
    model: "llama-3.3-70b-versatile",
    freeModel: true,
    color: "#0082FB",
    pricingUrl: "https://llama.meta.com",
    signupUrl: "https://www.meta.ai",
    tagline: "The open builder",
    strengths: ["Open source", "Coding", "Customizability"],
    bestForIndividual: "Technically curious users and learners",
    bestForBusiness: "Engineering teams wanting self-hosted or customized AI",
  },
]

export interface BenchmarkData {
  id: string
  title: string
  fullName: string
  tagline: string
  individual: {
    whatItTests: string
    plainEnglish: string
    realExample: string
  }
  business: {
    whatItTests: string
    plainEnglish: string
    realExample: string
  }
  nudgeLabel: string
  nudgePrompt: string
}

export const BENCHMARKS: BenchmarkData[] = [
  {
    id: "mmlu",
    title: "MMLU",
    fullName: "Massive Multitask Language Understanding",
    tagline: "How broadly knowledgeable is this AI across subjects?",
    individual: {
      whatItTests: "57 academic subjects from medicine to history. A generalist knowledge test.",
      plainEnglish: "A high MMLU score means the AI is a reliable generalist. Good for research help, explaining complex topics, or getting a grounded answer about health or legal questions.",
      realExample: "Ask it: 'My doctor mentioned I might have plantar fasciitis. What does that mean and what should I ask at my next appointment?' A high-MMLU AI gives you a trustworthy, medically grounded answer.",
    },
    business: {
      whatItTests: "Cross-domain reliability: can the AI answer confidently across legal, financial, scientific, and operational topics?",
      plainEnglish: "If your team needs AI that handles diverse questions reliably (HR policy, market research, compliance summaries), MMLU is the score to watch.",
      realExample: "Ask it: 'Summarize the key differences between GDPR and CCPA for a US e-commerce company.' A high-MMLU AI handles the cross-domain complexity without hallucinating.",
    },
    nudgeLabel: "Test general knowledge now",
    nudgePrompt: "Explain the difference between a Roth IRA and a traditional IRA in plain language, as if I have never invested before",
  },
  {
    id: "swe-bench",
    title: "SWE-bench",
    fullName: "Software Engineering Benchmark",
    tagline: "Can this AI actually fix real code bugs, not just explain them?",
    individual: {
      whatItTests: "Real GitHub issues from open-source software. Can the AI fix bugs in working code?",
      plainEnglish: "If you are learning to code or building a side project, SWE-bench tells you which AI will actually help you ship something, not just explain concepts.",
      realExample: "Ask it: 'My Python script crashes every time I read a CSV with special characters. Here is the code.' A high-SWE-bench AI finds the encoding bug and fixes it correctly.",
    },
    business: {
      whatItTests: "Can the AI be trusted to write production-level code? Will it introduce bugs or catch them?",
      plainEnglish: "For engineering teams, a high SWE-bench score is the difference between an AI assistant that saves 2 hours a day and one that creates new problems to debug.",
      realExample: "Ask it: 'Review this API endpoint for security vulnerabilities.' A high-SWE-bench AI catches the missing authentication check your junior dev missed.",
    },
    nudgeLabel: "Try a coding comparison",
    nudgePrompt: "Write a Python function that reads a CSV file and returns the top 5 rows sorted by a column called 'revenue', handling missing values gracefully",
  },
  {
    id: "mmmu",
    title: "MMMU",
    fullName: "Massive Multitask Multimodal Understanding",
    tagline: "Can this AI understand images, charts, and text together?",
    individual: {
      whatItTests: "Can the AI reason about images, diagrams, and text at the same time, not just text alone?",
      plainEnglish: "If you want to upload a photo of a confusing bill and get it explained, or snap a picture of a label and ask what is in it, MMMU is the score that matters.",
      realExample: "Upload a photo of a confusing electricity bill. Ask: 'What am I being charged for and is anything unusual?' A high-MMMU AI reads the document visually and flags the anomaly.",
    },
    business: {
      whatItTests: "Reading invoices, interpreting dashboards, analyzing product photos, reviewing design mockups.",
      plainEnglish: "For teams dealing with visual data daily (e-commerce, real estate, logistics, design), a high MMMU score means the AI can read what it sees, not just what it is told.",
      realExample: "Upload a product photo and a competitor's product photo. Ask: 'What are the key visual differences a customer would notice?' A high-MMMU AI gives a genuine visual analysis.",
    },
    nudgeLabel: "Try a visual reasoning prompt",
    nudgePrompt: "Describe what a chart showing exponential growth looks like and explain what it would mean for a small business seeing that pattern in their monthly revenue",
  },
  {
    id: "videomme",
    title: "VideoMME",
    fullName: "Video Multi-Modal Evaluation",
    tagline: "Can this AI understand what happens across an entire video?",
    individual: {
      whatItTests: "Can the AI watch a video and understand what happened in it, in sequence, over time?",
      plainEnglish: "Today most AI models handle video poorly. VideoMME is the benchmark that will define the next generation. It is less critical for individuals in 2026 but will matter enormously within 12 months.",
      realExample: "Upload a 20-minute cooking tutorial. Ask: 'Give me a timestamped list of every technique used.' A high-VideoMME AI tracks what happens across the full video, not just the first 30 seconds.",
    },
    business: {
      whatItTests: "Critical for any business working with video: meeting recordings, product demos, training videos, customer testimonials.",
      plainEnglish: "If your business generates video content, VideoMME performance will determine which AI can summarize, index, and analyze your library automatically.",
      realExample: "Upload a recorded sales call. Ask: 'What objections did the prospect raise and how did the rep handle each one?' A high-VideoMME AI produces a structured coaching report.",
    },
    nudgeLabel: "Try a video-related prompt",
    nudgePrompt: "I have a 30-minute recorded team meeting. Write me a prompt I could use with an AI to extract action items, decisions made, and open questions",
  },
]

export const USE_CASE_TAGS = ["writing", "research", "creative", "coding", "business"] as const
export type UseCaseTag = (typeof USE_CASE_TAGS)[number]

export const EXAMPLE_PROMPTS: Record<UseCaseTag, string> = {
  writing: "Write a thank-you email to my boss after a tough project",
  research: "Explain what inflation means for my savings",
  creative: "Give me a 7-day meal plan for someone who hates cooking",
  coding: "Write a Python function that reads a CSV and returns the top 5 rows by revenue",
  business: "Draft a cold outreach email to a potential client",
}

export const ROTATING_PLACEHOLDERS = [
  "Write a thank-you email to my boss after a tough project",
  "Explain what inflation means for my savings",
  "Give me a 7-day meal plan for someone who hates cooking",
  "Summarize the pros and cons of solar panels for a homeowner",
  "Draft a cold outreach email to a potential client",
]

export const PLATFORM_NUDGE_PROMPTS: Record<string, string> = {
  chatgpt: "Summarize the pros and cons of buying versus renting a home for a first-time buyer in their 30s",
  claude: "Write a short resignation letter that is professional and warm without being cold or cliche",
  gemini: "Describe what you see in this image and explain what a marketing team could do with it",
  mistral: "What are the key data privacy considerations a small European business should know about using AI tools?",
  grok: "What are the most talked-about AI developments from the past week and why do they matter?",
  meta: "Write a Python script that connects to a public API and saves the response as a formatted JSON file",
}
