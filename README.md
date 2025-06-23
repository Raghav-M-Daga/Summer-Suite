# InternFinder

A modern web application designed to help tech interns connect with each other, build professional networks, and find internship opportunities. Built with Next.js, Firebase, and TypeScript.

## 🌟 Features

### Authentication & User Management
- **Secure Authentication**: Email/password and Google OAuth sign-in
- **User Profiles**: Complete profile creation with personal and professional details
- **Profile Management**: Edit and update profile information anytime

### Networking & Connections
- **Find Matches**: Discover other interns based on location and profile information
- **Connection Requests**: Send and receive connection requests from other users
- **Friend Management**: Accept, reject, or remove connections
- **Real-time Updates**: Instant notifications for connection status changes

### User Interface
- **Modern Design**: Clean, professional interface with dark/light theme support
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Intuitive Navigation**: Easy-to-use interface with clear call-to-actions
- **Loading States**: Smooth user experience with proper loading indicators

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with modern hooks and features
- **TypeScript**: Type-safe development
- **Custom CSS**: Modern styling with CSS variables and utility classes

### Backend & Database
- **Firebase Authentication**: Secure user authentication
- **Firestore**: NoSQL database for user data and connections
- **Firebase Storage**: File storage capabilities

### Development Tools
- **ESLint**: Code quality and consistency
- **Turbopack**: Fast development builds
- **TypeScript**: Static type checking

## 📁 Project Structure

```
intern-finderr-web/
├── app/                    # Next.js App Router pages
│   ├── connections/        # Connection management
│   ├── details/           # Profile creation/editing
│   ├── find-matches/      # User discovery
│   ├── forgot-password/   # Password recovery
│   ├── home/              # Main dashboard
│   ├── sign-in/           # Authentication
│   └── sign-up/           # User registration
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components
│   ├── ThemedText.tsx    # Typography component
│   └── ThemedView.tsx    # Layout component
├── lib/                  # Core utilities
│   ├── AuthContext.tsx   # Authentication state management
│   └── firebase.ts       # Firebase configuration
├── hooks/                # Custom React hooks
└── constants/            # App constants and themes
```

## 🚀 Getting Started

Access via: https://intern-finder.vercel.app/

OR

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intern-finderr-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google Sign-in)
   - Create a Firestore database
   - Get your Firebase config and update `lib/firebase.ts`

4. **Environment Configuration**
   Create a `.env.local` file with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### For New Users

1. **Sign Up**: Create an account using email/password or Google OAuth
2. **Complete Profile**: Fill in your personal and professional details
3. **Find Matches**: Browse other interns in your area
4. **Send Connections**: Request to connect with interesting profiles
5. **Manage Connections**: Accept/reject incoming requests

### For Existing Users

1. **Sign In**: Access your account
2. **Update Profile**: Keep your information current
3. **Browse Matches**: Discover new connections
4. **Manage Network**: Handle connection requests and existing friends

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint with Next.js configuration for consistent code quality. All TypeScript files are strictly typed to ensure reliability.

### Database Schema

#### Users Collection
```typescript
interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  ethnicity: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phoneNumber?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Connection Requests Collection
```typescript
interface ConnectionRequest {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  message: string;
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🔮 Future Enhancements

- [ ] Real-time messaging between connected users
- [ ] Advanced search and filtering options
- [ ] Mobile app development
- [ ] Push notifications
- [ ] Analytics dashboard for user engagement

---

**Built with ❤️ for the tech intern community**
