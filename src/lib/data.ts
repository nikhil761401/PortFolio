// All content on this page is sourced directly from Nikhil. Nothing here is
// invented, estimated, or written as a plausible placeholder — if a fact
// (date, metric, technology) isn't listed below, it doesn't appear on the site.

export const profile = {
  name: "Nikhil",
  headline:
    "AI/ML Engineer & Researcher | Generative AI | Building Intelligent Products & Applications",
  bio: "AI/ML Engineer and Researcher specializing in Generative AI, LLM applications, RAG, agentic AI, and applied machine learning, with experience building production-grade AI systems and applications across web and mobile platforms. Experienced in developing scalable AI systems using Python, FastAPI, cloud platforms, and modern LLM architectures, with research experience in AI-driven unsupervised learning, and generative modeling.",
  // A shorter, hero-sized condensation of the bio above — same facts, fewer
  // words, so the hero block stays compact. The full bio still appears in
  // the About section; nothing here is a new claim.
  heroSummary:
    "AI/ML Engineer and Researcher specializing in Generative AI, LLM applications, RAG, and agentic AI — building production-grade AI systems with Python, FastAPI, and modern cloud platforms.",
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
  org: "Vellore Institute of Technology (VIT)",
  location: "Vellore, Tamil Nadu, India",
  year: "2024",
  description:
    "Advanced study in software engineering with a focus on software development, engineering practices, and applied technology.",
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
  pipeline: ["AI Product Engineering", "Machine Learning", "Computer Vision"],
  description:
    "Exploring the intersection of AI research and product engineering, with a focus on building intelligent systems through machine learning, deep learning, representation learning, and visual intelligence.",
  stages: ["Intelligent Products", "Machine Learning", "Deep Learning", "Visual Intelligence", "Applied AI Research"],
  interests: [
    "Generative AI",
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "Representation Learning",
    "AI Systems",
    "Generative Modeling",
    "Sequence Architectures",
    "Attention Mechanisms",
  ],
};

// Short factual bullets for the About section's "Key Highlights" grid — each
// one is a direct restatement of a fact that already exists in experience,
// projects, or education above. Nothing new is claimed here.
export const keyHighlights: string[] = [
  "AI/ML Researcher — Vellore Institute of Technology (2025–2026)",
  "Python Developer — Meta Scifor Technologies (2024–2025)",
  "M.Tech. Software Engineering — VIT (2024)",
  "Flagship project: CrackAI — AI Live Interview Platform",
  "Built systems spanning RAG, multi-agent orchestration, and LLM applications",
  "Hands-on across 30+ technologies spanning AI, backend, and cloud",
];

// Recommendations, transcribed verbatim from LinkedIn — quote is kept as the
// original three paragraphs rather than condensed, so nothing is reworded.
export type Testimonial = {
  name: string;
  role: string;
  date: string;
  context: string;
  quote: string[];
};

export const testimonials: Testimonial[] = [
  {
    name: "Farzana Rashid",
    role: "Robotics Team lead @robochamps | Project Manager @ Meta Scifor Technologies | Pythonist | Machine Learning | Artificial intelligence | Building Innovative Software Solutions",
    date: "September 7, 2024",
    context: "Worked with Nikhil on the same team",
    quote: [
      "I had the pleasure of working closely with Nikhil during his internship, and I can confidently say he exceeded all expectations. Nikhil demonstrated an incredible ability to quickly grasp new concepts, especially in Python, Django, and other development tools. His passion for learning, combined with a strong technical skill set, allowed him to consistently deliver high-quality results throughout his internship and training period.",
      "Nikhil is not just a developer who understands the technicalities; he brings creativity and innovation to his work, often finding the most efficient solutions to complex problems. His professionalism and commitment to projects have been exceptional, and he has contributed significantly to the success of several initiatives.",
      "I have no doubt that Nikhil will continue to excel in his career, and I highly recommend him to any organization looking for a talented, hardworking, and motivated developer.",
    ],
  },
];
