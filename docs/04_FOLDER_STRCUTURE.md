app/
├── api/
│   ├── generate/       # Replicate Logic (Route Handler)
│   ├── webhooks/       # Payment Webhooks (Route Handler)
├── r/
│   └── [code]/
│       └── route.ts    # The Redirector (Critical)
├── tea/
│   └── [userId]/
│       └── page.tsx    # Public Message Form
├── dashboard/
│   ├── layout.tsx      # Dashboard Sidebar/Auth Check
│   └── page.tsx        # User Admin (Protected)
├── layout.tsx          # Root Layout
└── page.tsx            # Landing Page
lib/
├── supabase/
│   ├── server.ts       # SSR Cookie Client
│   └── client.ts       # Browser Client
└── utils/
    ├── bot-detector.ts
    └── pdf-generator.ts
