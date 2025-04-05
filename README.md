# MP CarLink

A modern web application for vehicle management and sales, built with Next.js and Firebase.

## 🚀 Features

- **Authentication System**: Secure user authentication and authorization
- **Vehicle Management**: Comprehensive vehicle listing and management
- **Dashboard**: Real-time analytics and insights
- **AI Assistant**: Intelligent vehicle recommendations and assistance
- **Selling Platform**: Streamlined vehicle selling process
- **Responsive Design**: Mobile-first approach with modern UI components

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Firebase (Firestore, Storage)
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context API
- **UI Components**: Comprehensive Radix UI component library

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Firebase account and project setup

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mp_carlink.git
   cd mp_carlink
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Build for production**
   ```bash
   pnpm build
   ```

## 📁 Project Structure

```
mp_carlink/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── vehicles/          # Vehicle management pages
│   ├── sell/             # Selling platform pages
│   └── ai-assistant/     # AI assistant pages
├── components/            # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
└── styles/              # Global styles
```

## 🔧 Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint

## 🔒 Security

This project implements Firebase security rules for data protection. Make sure to:
- Keep your Firebase configuration secure
- Never expose sensitive API keys
- Follow security best practices for authentication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@mpcarlink.com or open an issue in the repository.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services
- Radix UI for accessible components
- All contributors and maintainers