# Flash Lubit Frontend 🤖💬

A modern, real-time AI chat application with multiple personality modes, avatar support, and voice interactions. Built with cutting-edge technologies for an immersive conversational experience.

## 🌟 Features

### 🎭 AI Personality Modes
- **Friendly Mode**: Warm, casual, and supportive conversations
- **Sad Mode**: Empathetic, understanding, and comforting responses
- **Formal Mode**: Professional, structured, and business-like communication
- **Custom Modes**: Expandable personality system for diverse interactions

### 👤 Avatar System
- **User Avatars**: Customizable profile pictures and character representations
- **AI Avatars**: Dynamic AI character visuals that match personality modes
- **Animated Talking**: Visual feedback during voice interactions
- **Avatar Customization**: Multiple avatar options and personalization

### 🗣️ Voice & Communication
- **Text-to-Speech**: AI responses with natural voice synthesis
- **Voice Input**: Speech recognition for hands-free interaction
- **Real-time Chat**: Instant messaging with live typing indicators
- **Message History**: Persistent conversation storage

### 🎨 Modern UI/UX
- **Responsive Design**: Seamless experience across all devices
- **Dark/Light Themes**: Customizable visual preferences
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Accessible Interface**: WCAG compliant design patterns

## 🚀 Tech Stack

### Frontend Framework
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - Latest React features and hooks

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library
- **Framer Motion** - Animation and gesture library
- **CSS Modules** - Scoped styling solutions

### Data & Communication
- **Axios** - Promise-based HTTP client
- **Socket.io Client** - Real-time bidirectional communication
- **React Query** - Server state management
- **Zustand** - Lightweight state management

### Performance & SEO
- **Next.js SEO** - Built-in search engine optimization
- **Image Optimization** - Automatic image optimization
- **Code Splitting** - Lazy loading and performance optimization
- **PWA Support** - Progressive Web App capabilities

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Git

### Clone Repository
```bash
git clone https://github.com/nrbnayon/Flash-Lubit-Frontend.git
cd Flash-Lubit-Frontend
```

### Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_SOCKET_URL=your_socket_server_url

# AI Service Keys
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Database (if applicable)
DATABASE_URL=your_database_connection_string

# File Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
Flash-Lubit-Frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Main application routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── chat/             # Chat-specific components
│   ├── avatar/           # Avatar components
│   └── common/           # Shared components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
├── styles/               # Additional styling files
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## 🎯 Key Components

### Chat Interface
```typescript
// components/chat/ChatInterface.tsx
- Real-time message rendering
- Typing indicators
- Message history
- Voice controls
```

### Avatar System
```typescript
// components/avatar/AvatarManager.tsx
- User avatar customization
- AI avatar animations
- Talking animations
- Avatar state management
```

### AI Personality Engine
```typescript
// lib/ai/personalityEngine.ts
- Mode switching logic
- Response tone adjustment
- Context awareness
- Personality persistence
```

## 🔧 Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Custom color palette
- Animation utilities
- Component-specific classes
- Dark mode support

### Shadcn/ui Setup
Components are configured with:
- Custom theme variables
- Accessible design tokens
- Consistent styling patterns
- Responsive breakpoints

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Ensure all production environment variables are set in your deployment platform.

### Build Optimization
```bash
# Production build
npm run build

# Analyze bundle
npm run analyze
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📱 Features in Detail

### Real-time Chat
- WebSocket connection for instant messaging
- Message delivery status indicators
- Typing awareness
- Connection status monitoring

### AI Personality Modes
- **Friendly**: Casual tone, emojis, encouraging responses
- **Sad**: Empathetic language, supportive messaging
- **Formal**: Professional vocabulary, structured responses
- **Creative**: Imaginative, artistic, out-of-the-box thinking

### Voice Features
- Speech-to-text input recognition
- Text-to-speech with natural voices
- Voice activity detection
- Audio quality optimization

### Avatar Customization
- Multiple avatar styles and themes
- Facial expression changes based on AI mood
- Talking animation synchronization
- User avatar upload and editing

## 🔐 Security

- Input sanitization and validation
- XSS protection
- CSRF token implementation
- Secure API communication
- User authentication and authorization

## 📈 Performance

- Code splitting and lazy loading
- Image optimization and lazy loading
- Caching strategies
- Bundle size optimization
- Core Web Vitals optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Write comprehensive tests
- Update documentation
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Component library
- [OpenAI](https://openai.com/) - AI language models
- [ElevenLabs](https://elevenlabs.io/) - Voice synthesis
- [Vercel](https://vercel.com/) - Deployment platform

## 🔗 Links

- **Live Demo**: [https://flash-lubit-frontend.vercel.app/](https://flash-lubit-frontend.vercel.app/)
- **GitHub Repository**: [https://github.com/nrbnayon/Flash-Lubit-Frontend.git](https://github.com/nrbnayon/Flash-Lubit-Frontend.git)
- **Documentation**: [Project Wiki](https://github.com/nrbnayon/Flash-Lubit-Frontend/wiki)
- **Issues**: [Bug Reports & Feature Requests](https://github.com/nrbnayon/Flash-Lubit-Frontend/issues)

## 📞 Support

For support, email nrbnayon@gmail.com or join our [Discord community](https://discord.gg/flash-lubit).

---

**Built with ❤️ by [nrbnayon](https://github.com/nrbnayon)**

*"Making AI conversations more human, one chat at a time."*
