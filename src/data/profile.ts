export const profile = {
  name: "Martin Tran",
  headline:
    "Software engineer building backend systems, cloud workflows, and applied AI.",
  lookingFor:
    "Looking for Software Engineer / Backend / Applied AI internships where I can ship production systems, own APIs and data pipelines, and harden AI features that stay grounded in deterministic logic.",
  aboutPreview: [
    "I'm Martin Tran, a CS student at Cal State Fullerton building resilient backend systems, cloud architectures, and applied AI tooling.",
    "While I build across the entire stack, I spend most of my time behind the scenes: architecting event-driven data pipelines, securing database schemas, and ensuring services scale predictably under load.",
  ],
  aboutMore: [
    "My recent work centers on AWS (Bedrock, Step Functions, S3) and modern Postgres backends with Row Level Security, frequently designing hybrid agent workflows where models parse context while strict code executes the business logic.",
    "I value modular design, tight system boundaries, and catching the weird failure modes before users do.",
    "When I am not working on coursework, I am usually building side projects to test new architectures, experiment with game engines, and turn complex ideas into working software.",
  ],
  labHref: "https://martintran23.github.io/portfolio",
  labPhrase: "interactive lab-themed portfolio",
  experience: [
    {
      role: "Software Development Intern",
      company: "OpenQQuantify",
      location: "Remote / Vienna, VA",
      dates: "May 2025 - Oct 2025",
      bullets: [
        "Built an AI health assistant chatbot on FDA drug label data (local LLMs / Hugging Face for semantic search and FAQ-style dialogue).",
        "Improved FAQ accuracy by ~50% and cut response time by ~10 seconds.",
        "Built a Python ETL pipeline over 50K+ drug label records, cutting ~15 hrs/week of manual prep.",
        "Designed RESTful APIs and a responsive chat frontend in an Agile, Git-based workflow.",
      ],
    },
    {
      role: "AI Engineer Intern",
      company: "Product Manager Accelerator",
      location: "Remote",
      dates: "Jun 2025 - Sep 2025",
      bullets: [
        "Built backend services for an AI-powered emotional support / journaling product (Kyrah AI MVP).",
        "Designed MongoDB schemas and FastAPI endpoints for journal entries and chat history.",
        "Collaborated on branch-based Git workflows and schema updates for new features.",
      ],
    },
  ],
  education: {
    degree:
      "B.S. Computer Science, Concentration in Artificial Intelligence and Machine Learning",
    school: "Cal State University, Fullerton",
    dates: "Expected Dec 2027",
  },
  skills: [
    {
      label: "Languages",
      items: ["Python", "TypeScript", "JavaScript", "SQL"],
    },
    {
      label: "Frameworks and tools",
      items: [
        "Next.js",
        "React",
        "Node.js",
        "FastAPI",
        "Flask",
        "Tailwind",
        "Vitest",
        "Streamlit",
        "boto3",
        "Postman",
        "Git",
      ],
    },
    {
      label: "Databases",
      items: ["MongoDB", "PostgreSQL", "Supabase"],
    },
    {
      label: "Cloud and DevOps",
      items: [
        "AWS",
        "Bedrock",
        "S3",
        "API Gateway",
        "Step Functions",
        "Amplify",
        "Vercel",
        "REST APIs",
        "CI/CD",
        "Docker",
        "Linux/Unix",
      ],
    },
  ],
  featuredWork: [
    {
      name: "RevenueTwin",
      href: "/work/revenuetwin",
      pitch: "AI revenue audit with deterministic fee math.",
    },
    {
      name: "WeCalendar",
      href: "/work/wecalendar",
      pitch: "Shared calendar and notes with realtime sync.",
    },
    {
      name: "WattTime",
      href: "/work/watttime",
      pitch: "Solar usage optimizer on AWS.",
    },
  ],
  contacts: {
    email: "23martintran@gmail.com",
    linkedin: "https://www.linkedin.com/in/23martintran/",
    github: "https://github.com/martintran23",
  },
} as const;
