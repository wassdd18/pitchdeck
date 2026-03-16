# 🌐 BiConnect  
### Community Circle App — Find People Near You (React Native + Expo + Appwrite)

> 🚀 A production-ready mobile app for discovering and joining local interest-based communities, built with Expo Router, Appwrite, and Google Maps.

---

## 📑 Table of Contents

- [About](#about)
- [Core Features](#core-features)
  - [Authentication & User Management](#authentication--user-management)
  - [Map & Circle Discovery](#map--circle-discovery)
  - [Messages & My Circles](#messages--my-circles)
  - [Profile Management](#profile-management)
  - [Reusable UI Components](#reusable-ui-components)
- [Authentication & Database](#authentication--database)
- [Project Architecture](#project-architecture)
- [Installation & Running](#installation--running)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Contact](#contact)

---

## About

**BiConnect** is a **React Native (Expo)** mobile application that helps people discover and join local interest-based community circles — hobby groups, meetups, and educational sessions near them.

Developed as part of the **MEET – Middle East Entrepreneurs of Tomorrow** program, it connects people across communities through shared interests and geographic proximity.

### 🎯 What This App Does

- Lets users register with full personal profiles
- Shows a live map of nearby community circles
- Filters circles based on user's declared hobbies and interests
- Allows joining circles with one tap — saved to user profile
- Provides a messages tab with personal chats and joined circles list
- Full profile editing with avatar upload

Ideal for:

- Community building platforms
- Local event discovery apps
- Educational group coordination
- Social networking startups

---

## Core Features

### Authentication & User Management

- Email/password registration with multi-step flow
- Secure login with persistent session via **Appwrite**
- Forgot password with email recovery link
- Full profile management (name, location, language, avatar)
- Centralized authentication logic via `AuthContext`
- Structured loading & error states throughout the app

---

### Map & Circle Discovery

Powered by **Google Maps (react-native-maps)** and **expo-location**

Capabilities:

- Live user location detection
- Interactive map with circle markers
- Search bar filtering by name, location, or category
- Smart recommendations based on user's hobbies
- One-tap JOIN button with animation — synced to Appwrite profile
- Circles saved to `user.prefs.joinedCircles` in real time

---

### Messages & My Circles

- Messages tab with conversation list and unread badges
- "My Circles" tab showing all circles the user has joined
- Expandable circle cards with location and time info
- Smooth tab switching animation
- Empty state with friendly call-to-action

---

### Profile Management

- Avatar picker via `expo-image-picker`
- Edit name, location, language via bottom sheet modal
- Hobbies displayed as chips
- Logout with confirmation dialog
- All changes synced to Appwrite via `updateProfile`

---

### Reusable UI Components

Professional design system including:

- `ThemedButton` — primary, outline, ghost, danger variants
- `ThemedText` — title, subtitle, default, small, caption, link, error
- `ThemedView` — background-aware container
- `Card` — shadow card wrapper
- `StepIndicator` — multi-step progress dots
- `BottomNav` — animated 3-tab navigation bar with active state

All components use a centralized `theme.js` with colors, spacing, typography (Judson + Inter fonts), shadows, and border radii.

---

## Authentication & Database

Built on **Appwrite Cloud**:

- `account.create` — registration
- `account.createEmailPasswordSession` — login
- `account.updateName` — name update
- `account.updatePrefs` — prefs update (location, language, hobbies, avatar, joined circles)
- `account.createRecovery` — password reset
- `account.deleteSession` — logout

### Authentication Flow

1. App launches → Fetch current session from Appwrite
2. Registration (4 steps) → Create account → Save prefs
3. Login → Validate credentials → Fetch user
4. Profile update → Patch name + prefs
5. Join circle → Append to `user.prefs.joinedCircles`
6. Logout → Delete session → Redirect to Welcome

---

## Project Architecture

```
pitchdeck/
│
├── app/
│   ├── _layout.tsx              # Root layout — fonts, providers, Stack
│   └── (tabs)/
│       ├── _layout.tsx          # Tabs layout — all screen declarations
│       ├── index.js             # Welcome screen
│       ├── login.js             # Login screen
│       ├── forgot-password.js   # Password recovery
│       ├── success.js           # Post-login/register success
│       ├── home.js              # Map + search + circles
│       ├── messages.js          # Messages + My Circles
│       ├── user-profile.js      # Profile + edit modal
│       └── register/
│           ├── _layout.js       # Register sub-stack
│           ├── index.js         # Step 1 — Personal info
│           ├── location.js      # Step 2 — Location
│           ├── profile.js       # Step 3 — Avatar + preview
│           └── hobbies.js       # Step 4 — Interests + submit
│
├── components/
│   └── ui/
│       ├── bottom-nav.js
│       ├── card.js
│       ├── step-indicator.js
│       ├── themed-button.js
│       ├── themed-text.js
│       └── themed-view.js
│
├── contexts/
│   ├── auth-context.js          # Auth state + Appwrite calls
│   └── registration-context.js  # Multi-step registration state
│
├── lib/
│   ├── appwrite.js              # Appwrite client config
│   └── theme.js                 # Colors, fonts, spacing, shadows
│
└── hooks/
    └── use-auth.js              # Re-export of useAuth
```

---

## Installation & Running

### Prerequisites

- Node.js (v18+)
- Git
- Expo CLI
- Expo Go (iOS / Android)

---

### Setup

```bash
# Clone repository
git clone https://github.com/wassdd18/meet_project

# Navigate into project
cd pitchdeck

# Install dependencies
npm install

# Install required native packages
npx expo install react-native-maps expo-location expo-image-picker @react-native-community/datetimepicker @expo-google-fonts/inter @expo-google-fonts/judson

# Start development server
npx expo start --clear
```

---

### Environment Setup

**1. Appwrite** — create a project at [cloud.appwrite.io](https://cloud.appwrite.io) and update `lib/appwrite.js`:
```js
endpoint:   'https://fra.cloud.appwrite.io/v1',
projectId:  'YOUR_PROJECT_ID',
databaseId: 'YOUR_DATABASE_ID',
```

**2. Google Maps** — get an API key at [console.cloud.google.com](https://console.cloud.google.com) and update `app.json`:
```json
"ios":     { "config": { "googleMapsApiKey": "YOUR_KEY" } },
"android": { "config": { "googleMaps": { "apiKey": "YOUR_KEY" } } }
```

---

### Running the App

- Press `i` → iOS Simulator
- Press `a` → Android Emulator
- Scan QR code with Expo Go

---

## Roadmap

### Version 1.0 (Current)

- [x] Full registration flow (4 steps)
- [x] Login / Logout / Forgot password
- [x] Google Maps integration with user location
- [x] Circle discovery with hobby-based recommendations
- [x] Join circles — synced to Appwrite profile
- [x] Messages tab with My Circles list
- [x] Profile page with edit modal and avatar picker
- [x] Animated bottom navigation bar
- [x] Custom font system (Judson + Inter)

### Version 2.0

- [ ] Real circle database in Appwrite with map coordinates
- [ ] Real-time messaging between users
- [ ] Push notifications for circle events
- [ ] Circle creation by users
- [ ] Attendee list for each circle

### Version 3.0

- [ ] AI-powered circle recommendations
- [ ] In-app events calendar
- [ ] RTL language support (Arabic / Hebrew)
- [ ] Multi-language UI

---

## Contributing

We welcome:

- Bug reports
- Feature suggestions
- Pull requests
- UI/UX improvements
- Backend enhancements

### Contribution Steps

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## Contact

📧 Email: feliksy810@gmail.com  
🐙 GitHub: https://github.com/wassdd18  

---

Made with ❤️ for the MEET community
