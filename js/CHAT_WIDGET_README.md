# Waffle Chat Widget Integration

## Files
- `ChatWidget.jsx` - React/Next.js component
- `chat-widget.js` - Vanilla JavaScript version
- `chat-widget.css` - Standalone CSS (for vanilla JS)
- `api-chat-route.js` - API route handler (Next.js)

---

## Option 1: Next.js (React)

### 1. Install Anthropic SDK
```bash
npm install @anthropic-ai/sdk
```

### 2. Add Environment Variable
```bash
# .env.local
ANTHROPIC_API_KEY=your-api-key-here
```

### 3. Create API Route

**App Router (Next.js 13+):** Copy `api-chat-route.js` to `app/api/chat/route.js`

**Pages Router:** Copy `api-chat-route.js` to `pages/api/chat.js` and use the default export

### 4. Import Component
```jsx
import ChatWidget from '@/components/ChatWidget';

export default function Page() {
  return (
    <div>
      <ChatWidget />
    </div>
  );
}
```

### 5. Props
| Prop | Default | Description |
|------|---------|-------------|
| `buttonText` | "Waffle" | Text on trigger button |
| `apiEndpoint` | "/api/chat" | Chat API endpoint |

---

## Option 2: Static HTML (Vanilla JS)

### 1. Include Files
```html
<link rel="stylesheet" href="js/chat-widget.css">
<script src="js/chat-widget.js"></script>
```

### 2. Auto-Initialize with Data Attributes
```html
<div data-waffle-chat data-api-endpoint="/api/chat" data-button-text="Waffle"></div>
```

### 3. Or Initialize Manually
```html
<div id="chat-container"></div>
<script>
  const chat = new WaffleChat({
    apiEndpoint: '/api/chat',
    buttonText: 'Waffle',
    initialMessage: "Hi! Ask me about my work, projects, or experience."
  });
  chat.mount('#chat-container');
</script>
```

---

## Backend Setup (Non-Next.js)

For static sites, you need a backend to proxy Claude API calls. Options:

### Express.js Server
```javascript
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: 'Your system prompt here',
    messages,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta') {
      res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`);
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
});

app.listen(3000);
```

### Cloudflare Workers / Vercel Serverless
Adapt the `api-chat-route.js` file for your serverless platform.

---

## Customization

### Colors (in CSS)
```css
:root {
  --waffle-primary: #1E3A8A;    /* Blue accent */
  --waffle-bg: #FAFAFA;          /* Background */
  --waffle-text: #0F172A;        /* Text color */
}
```

### System Prompt
Edit the `SYSTEM_PROMPT` constant in `api-chat-route.js` to customize the AI personality and knowledge.
