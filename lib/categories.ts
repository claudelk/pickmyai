// ─── Category Types ──────────────────────────────────────────────────

export interface EvaluationCriterion {
  label: string
  description: string
}

export interface CategoryConfig {
  id: string
  name: string
  status: "available" | "coming_soon"
  defaultPrompt: string
  hint: string
  criteria: EvaluationCriterion[]
  /** Gradient colors for tile background fallback */
  gradient: string
  /** Icon name for tile */
  icon: string
  /** Background image path */
  image: string
}

// ─── Categories ──────────────────────────────────────────────────────

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "rewriting",
    name: "Rewriting & Editing",
    status: "available",
    defaultPrompt:
      "Rewrite this paragraph to sound more professional while keeping the same meaning: 'Hey team, just wanted to flag that the project is kinda behind schedule. We probably need to figure out what went wrong and get things back on track ASAP. Let me know what you think.'",
    hint: "This prompt is designed to test rewriting and editing skills. Feel free to use it or write your own.",
    criteria: [
      { label: "Tone", description: "Does it sound professional without being robotic?" },
      { label: "Clarity", description: "Is the message easy to understand?" },
      { label: "Structure", description: "Is it well-organized and logical?" },
      { label: "Conciseness", description: "Does it say more with fewer words?" },
    ],
    gradient: "from-amber-400 to-orange-500",
    icon: "pencil",
    image: "/categories/rewriting.png",
  },
  {
    id: "analysis",
    name: "Analysis & Reasoning",
    status: "available",
    defaultPrompt:
      "A small startup (8 people) is debating whether to stay fully remote or move to a hybrid office model. The CEO wants in-person collaboration, but 3 key engineers prefer remote. Lay out the strongest arguments for each side and suggest a compromise.",
    hint: "This prompt is designed to test analysis and reasoning. Feel free to use it or write your own.",
    criteria: [
      { label: "Depth", description: "Does it go beyond surface-level arguments?" },
      { label: "Logical flow", description: "Are the arguments well-structured?" },
      { label: "Completeness", description: "Does it cover both sides fairly?" },
      { label: "Nuance", description: "Does it acknowledge trade-offs and gray areas?" },
    ],
    gradient: "from-blue-400 to-indigo-500",
    icon: "brain",
    image: "/categories/analysis.png",
  },
  {
    id: "creative",
    name: "Creative Writing",
    status: "available",
    defaultPrompt:
      "Write the opening paragraph of a short story about someone who discovers that every book in their local library has had its last page removed.",
    hint: "This prompt is designed to test creative writing. Feel free to use it or write your own.",
    criteria: [
      { label: "Creativity", description: "Is the approach original and surprising?" },
      { label: "Voice", description: "Does it have a distinct style or personality?" },
      { label: "Engagement", description: "Does it make you want to keep reading?" },
      { label: "Originality", description: "Does it avoid clichés and predictable setups?" },
    ],
    gradient: "from-purple-400 to-pink-500",
    icon: "feather",
    image: "/categories/creative.png",
  },
  {
    id: "coding",
    name: "Coding",
    status: "available",
    defaultPrompt:
      "Write a Python function that takes a list of dictionaries representing employees (with 'name', 'department', and 'salary' keys) and returns a summary showing: average salary per department, the highest-paid employee, and any departments with only one person.",
    hint: "This prompt is designed to test coding ability. Feel free to use it or write your own.",
    criteria: [
      { label: "Correctness", description: "Does the code work as intended?" },
      { label: "Efficiency", description: "Is the approach performant and well-optimized?" },
      { label: "Readability", description: "Is the code clean and easy to follow?" },
      { label: "Explanation", description: "Does it explain the approach clearly?" },
    ],
    gradient: "from-emerald-400 to-teal-500",
    icon: "code",
    image: "/categories/coding.png",
  },
  {
    id: "image_gen",
    name: "Image Generation",
    status: "coming_soon",
    defaultPrompt: "",
    hint: "",
    criteria: [],
    gradient: "from-gray-300 to-gray-400",
    icon: "image",
    image: "/categories/image_gen.png",
  },
  {
    id: "video_gen",
    name: "Video Generation",
    status: "coming_soon",
    defaultPrompt: "",
    hint: "",
    criteria: [],
    gradient: "from-gray-300 to-gray-400",
    icon: "video",
    image: "/categories/video_gen.png",
  },
  {
    id: "music_gen",
    name: "Music Generation",
    status: "coming_soon",
    defaultPrompt: "",
    hint: "",
    criteria: [],
    gradient: "from-gray-300 to-gray-400",
    icon: "music",
    image: "/categories/music_gen.png",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────

export const AVAILABLE_CATEGORIES = CATEGORIES.filter((c) => c.status === "available")

/** Default "Not sure?" preset: Rewriting + Creative + Analysis */
export const BEGINNER_PRESET_IDS = ["rewriting", "creative", "analysis"]

export function getCategoryById(id: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.id === id)
}
