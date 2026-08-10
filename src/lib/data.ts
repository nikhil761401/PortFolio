// All content on this page is sourced directly from Nikhil. Nothing here is
// invented, estimated, or written as a plausible placeholder — if a fact
// (date, metric, technology) isn't listed below, it doesn't appear on the site.

export const profile = {
  name: "Nikhil",
  headline:
    "AI/ML Engineer & Researcher | Generative AI | Building Intelligent Products & Applications",
  bio: "AI/ML Engineer and Researcher specializing in Generative AI, LLM applications, RAG, agentic AI, and applied machine learning, with experience building production-grade AI systems and applications across web and mobile platforms. Experienced in developing scalable AI systems using Python, FastAPI, cloud platforms, and modern LLM architectures, with research experience in AI-driven unsupervised learning, and generative modeling.",
};

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  location: string;
  bullets: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "AI/ML Researcher",
    org: "Vellore Institute of Technology",
    period: "Apr 2025 – Jul 2026",
    location: "Vellore, India",
    bullets: [
      "Developed an AI system for semantic content extraction and context-preserving video summarization.",
      "Examined unsupervised learning, generative modeling, sequence architectures, attention mechanisms, and feature representations for video understanding.",
      "Engineered and evaluated summarization pipelines using benchmark datasets and quantitative evaluation metrics to improve summary quality.",
    ],
  },
  {
    role: "Python Developer",
    org: "Meta Scifor Technologies",
    period: "Jan 2024 – Apr 2025",
    location: "Bengaluru, India",
    bullets: [
      "Engineered Python-based backend systems and AI-powered chatbot functionality for an E-Learning platform, supporting core learning and application workflows.",
      "Engineered the Python backend for a competitive-events platform supporting hackathons, coding competitions, registrations, and participant workflows.",
      "Developed data-driven platforms, including an Athlete Management System for managing athlete data and performance metrics, while delivering scalable backend solutions across multiple web applications.",
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  headline: string;
  capability: string;
  flagship?: boolean;
  bullets: string[];
  stack: string[];
};

export const projects: Project[] = [
  {
    slug: "crackai",
    name: "CrackAI",
    headline: "AI Live Interview Platform",
    capability: "AI product engineering",
    flagship: true,
    bullets: [
      "Built a production-scale AI interview platform using LLMs, AI personalization, and hybrid AI workflows.",
      "Engineered scalable FastAPI services integrating AI interviews, resume analysis, and intelligent feedback on GCP.",
    ],
    stack: ["Gemini AI", "FastAPI", "Firebase", "Firestore", "Docker", "GCP", "Prompt Engineering"],
  },
  {
    slug: "knowledge-copilot",
    name: "Enterprise Knowledge Copilot",
    headline: "Enterprise RAG Platform",
    capability: "RAG / retrieval systems",
    bullets: [
      "Built an enterprise RAG platform with semantic search, document retrieval, and citation-backed AI responses.",
      "Engineered retrieval pipelines using embeddings, vector databases, reranking, and LangChain.",
    ],
    stack: ["LangChain", "LlamaIndex", "Pinecone", "FastAPI", "LangSmith", "Ragas", "MLflow"],
  },
  {
    slug: "multi-agent",
    name: "Multi-Agent AI Research Assistant",
    headline: "Agentic Orchestration System",
    capability: "Agentic AI / orchestration",
    bullets: [
      "Built a multi-agent AI system enabling collaborative reasoning, planning, and autonomous task execution.",
      "Engineered agent orchestration with LangGraph, MCP, tool calling, memory, and scalable FastAPI services.",
    ],
    stack: ["LangGraph", "MCP", "FastAPI", "Docker", "Kubernetes", "Redis"],
  },
];

// Same four categories and exact technology lists as before, restructured
// as an ordered array (rather than a Record) so each category can carry a
// short, generic one-line framing without inventing any new capability.
export type SkillGroup = {
  title: string;
  description: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "AI & LLM",
    description: "Building intelligent applications and workflows around modern foundation models.",
    items: [
      "LLM Application Development",
      "Prompt Engineering",
      "Structured JSON Outputs",
      "JSON Schema Validation",
      "RAG",
      "Embeddings",
      "Vector Databases",
      "LangChain",
      "LlamaIndex",
      "LangGraph",
      "AI Agents",
      "MCP",
      "Tool Calling",
      "AI Personalization",
      "Ragas/DeepEval",
      "LangSmith",
    ],
  },
  {
    title: "Machine Learning",
    description: "Core ML foundations behind the systems I build and research.",
    items: ["Python", "PyTorch", "Transformers", "Hugging Face"],
  },
  {
    title: "Backend & Cloud",
    description: "Scalable services and infrastructure that ship AI products to production.",
    items: [
      "FastAPI",
      "REST APIs",
      "Docker",
      "Kubernetes",
      "Google Cloud Platform (Cloud Run)",
      "Firebase",
      "Firestore",
      "Redis",
    ],
  },
  {
    title: "Software Engineering",
    description: "Engineering practices behind building and maintaining reliable systems.",
    items: [
      "Git",
      "Linux",
      "SQL",
      "System Design",
      "CI/CD",
      "Authentication (JWT/OAuth)",
      "Microservices",
    ],
  },
];

export const education = {
  degree: "M.Tech. Software Engineering",
  org: "Vellore Institute of Technology",
  year: "2024",
};

// Broader positioning for the "What I Build" section — distinct from the
// three featured projects above, covering the range of work rather than
// restating individual products.
export type Capability = {
  title: string;
  description: string;
};

export const capabilities: Capability[] = [
  {
    title: "Intelligent Products",
    description: "AI-powered applications and platforms",
  },
  {
    title: "AI Systems",
    description: "Generative AI, retrieval, agents, and personalization",
  },
  {
    title: "Software Systems",
    description: "Backend services, APIs, and cloud infrastructure",
  },
  {
    title: "Research",
    description: "Machine learning, video understanding, and generative modeling",
  },
];

// Research Focus section content — kept separate from the Experience entry
// it draws from so the two sections don't repeat each other. Terminology is
// scoped to what the AI/ML Researcher role at VIT already establishes.
export const researchFocus = {
  pipeline: ["Video Understanding", "Semantic Content Extraction", "Context-Preserving Summarization"],
  description:
    "Investigating how unsupervised representations, temporal information, sequence modeling, and attention mechanisms can identify semantically important information in long-form video.",
  stages: ["Long-Form Video", "Representation", "Semantic Content", "Context", "Concise Summary"],
};
