export const profile = {
  name: "Martin Tran",
  headline:
    "Software engineer building backend systems, cloud workflows, and applied AI.",
  lookingFor:
    "Looking for a Spring 2027 Software Engineering or AI Engineering internship or co-op with real ownership: backend systems I can take end to end, and applied AI I can own the same way.",
  aboutPreview: [
    "I'm Martin Tran, a Computer Science student at Cal State Fullerton and software engineer specializing in resilient backend systems, cloud architectures, and applied AI tooling.",
    "Most of my work is centered around AI and ML applications, but I love exploring new tech and picking up whatever a project needs. I am open to learning new tools and fields along the way.",
  ],
  aboutMore: [
    "Right now, I'm working towards finishing my bachelor's degree, participating in hackathons, developing personal projects, and collaborating on an industry capstone with RTX. Outside of that, I'm usually building something small to try a new idea or clean up how a system fits together.",
    "I'm currently looking for teams where I can own a real slice of the product, from how the data moves around to how people actually use it. I learn fastest when the work is concrete and I can see what breaks.",
  ],
  experience: [
    {
      role: "Software Development Intern",
      company: "OpenQQuantify",
      location: "Remote / Vienna, VA",
      dates: "May 2025 - Oct 2025",
      summary:
        "Worked on an AI health assistant that answered questions from FDA drug label data, spanning the data pipeline, APIs, and chat interface.",
    },
    {
      role: "AI Engineer Intern",
      company: "Product Manager Accelerator",
      location: "Remote",
      dates: "Jun 2025 - Sep 2025",
      summary:
        "Worked on the backend for Kyrah AI, an emotional support and journaling product, including how journal entries and chat history were stored and served.",
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
  resumeHref: "/Martin-Tran-Resume.pdf",
  contacts: {
    email: "23martintran@gmail.com",
    linkedin: "https://www.linkedin.com/in/23martintran/",
    github: "https://github.com/martintran23",
  },
} as const;
