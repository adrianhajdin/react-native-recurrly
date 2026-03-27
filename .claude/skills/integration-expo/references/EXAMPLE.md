# PostHog Expo Example Project

Repository: https://github.com/PostHog/context-mill
Path: basics/expo

---

## README.md

# Burrito Consideration App (Expo)

A React Native Expo app demonstrating PostHog product analytics integration with modern React Native best practices.

## Features

- **Product Analytics**: Full PostHog integration with event tracking
- **Autocapture**: Touch events and screen tracking
- **Error Tracking**: Manual exception capture with `$exception` events
- **User Authentication**: Demo login with PostHog user identification
- **Session Persistence**: AsyncStorage for session management
- **Modern React**: React 19 with React Compiler for automatic memoization
- **File-based Routing**: Expo Router for navigation
- **New Architecture**: Enabled by default for better performance

## Project Structure

```text
basics/expo/
├── app/                          # Expo Router screens (file-based routing)
│   ├── _layout.tsx               # Root layout with PostHogProvider + AuthProvider
│   ├── index.tsx                 # Home screen (login/welcome)
│   ├── burrito.tsx               # Burrito consideration screen
│   └── profile.tsx               # User profile screen
├── src/
│   ├── config/
│   │   └── posthog.ts            # PostHog client configuration
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication context with PostHog
│   ├── services/
│   │   └── storage.ts            # AsyncStorage wrapper
│   └── styles/
│       └── theme.ts              # Shared style constants
├── app.json                      # Expo configuration
├── babel.config.js               # Babel config with React Compiler
├── eslint.config.js              # ESLint flat config
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript strict configuration
└── .env.example                  # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+
- iOS: Xcode (for iOS Simulator)
- Android: Android Studio with emulator

**For Android builds:** Set environment variables (required):

Add to `~/.zshrc` or `~/.bashrc`:
```bash
# Java from Android Studio (required for Gradle)
export JAVA_HOME="<path-to-android-studio-jdk>"

# Android SDK location
export ANDROID_HOME="$HOME/Library/Android/sdk"
```

Examples:
- `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`
- `export ANDROID_HOME="$HOME/Library/Android/sdk"`

Then run `source ~/.zshrc` to apply.

### Installation

1. Install dependencies:
   ```bash
   cd basics/expo
   npm install
   ```

2. Configure PostHog (optional):
   ```bash
   cp .env.example .env
   # Edit .env with your PostHog project token
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

### Running the App

```bash
# Start development server
npx expo start

# Run on iOS Simulator
npx expo run:ios

# Run on Android Emulator
npx expo run:android
```

## PostHog Integration

### Configuration

PostHog is configured in `src/config/posthog.ts` using environment variables from `app.json`:

```typescript
import Constants from 'expo-constants'

const apiKey = Constants.expoConfig?.extra?.posthogProjectToken
```

### Event Tracking

Events are captured with properties:

```typescript
posthog.capture('burrito_considered', {
  total_considerations: count,
  username: user.username,
})
```

### User Identification

Users are identified on login:

```typescript
posthog.identify(username, {
  $set: { username },
  $set_once: { first_login_date: new Date().toISOString() },
})
```

### Screen Tracking

Manual screen tracking with Expo Router:

```typescript
useEffect(() => {
  posthog.screen(pathname, {
    previous_screen: previousPathname.current,
  })
}, [pathname])
```

### Error Tracking

Manual exception capture:

```typescript
posthog.capture('$exception', {
  $exception_type: error.name,
  $exception_message: error.message,
  $exception_stack_trace_raw: error.stack,
})
```

## Modern React Features

### React Compiler

Automatic memoization is enabled via `babel-plugin-react-compiler`. No need for manual `useMemo`, `useCallback`, or `React.memo`.

### React 19 `use` API

The `useAuth` hook uses the new `use` API for context:

```typescript
export function useAuth() {
  const context = use(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### New Architecture

Enabled in `app.json` for better performance:

```json
{
  "expo": {
    "newArchEnabled": true
  }
}
```

## Building for Production

Use EAS Build for production builds:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Performance Debugging

1. Press `J` in Expo CLI to open Chrome DevTools
2. Go to: **Profiler > [Gear icon] > "Highlight updates when components render"**
3. Interact with your app to see which components re-render

## Tech Stack

- **Expo SDK 54** - Managed workflow
- **React 19** - Latest React with Compiler support
- **React Native 0.81** - Latest stable
- **Expo Router 6** - File-based navigation
- **PostHog** - Product analytics
- **TypeScript** - Strict mode enabled
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Native gestures

## License

MIT

---

## .env.example

```example
POSTHOG_PROJECT_TOKEN=phc_your_project_token_here
POSTHOG_HOST=https://us.i.posthog.com

```

---

## .npmrc

```ini
legacy-peer-deps=true

```

---

## app.config.js

```js
export default {
  expo: {
    name: 'BurritoApp',
    slug: 'burrito-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    experiments: {
      reactCompiler: true,
    },
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#333333',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.posthog.burritoapp',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#333333',
      },
      package: 'com.posthog.burritoapp',
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    scheme: 'burritoapp',
    extra: {
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
    },
    plugins: ['expo-router', 'expo-localization'],
  },
}

```

---

## app/_layout.tsx

```tsx
import { Stack, usePathname, useGlobalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { PostHogProvider } from 'posthog-react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AuthProvider } from '../src/contexts/AuthContext'
import { posthog } from '../src/config/posthog'
import { colors } from '../src/styles/theme'

export default function RootLayout() {
  const pathname = usePathname()
  const params = useGlobalSearchParams()
  const previousPathname = useRef<string | undefined>(undefined)

  // Manual screen tracking for Expo Router
  // @see https://docs.expo.dev/router/reference/screen-tracking/
  // React Compiler will auto-optimize this effect
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        // Include route params for analytics (filter sensitive data if needed)
        ...params,
      })
      previousPathname.current = pathname
    }
  }, [pathname, params])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={colors.headerBackground} />
        <PostHogProvider
          client={posthog}
          autocapture={{
            captureScreens: false, // Manual tracking with Expo Router
            captureTouches: true,
            propsToCapture: ['testID'],
            maxElementsCaptured: 20,
          }}
        >
          <AuthProvider>
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: colors.headerBackground },
                headerTintColor: colors.headerText,
                headerTitleStyle: { fontWeight: 'bold' },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" options={{ title: 'Burrito App' }} />
              <Stack.Screen name="burrito" options={{ title: 'Burrito Consideration' }} />
              <Stack.Screen name="profile" options={{ title: 'Profile' }} />
            </Stack>
          </AuthProvider>
        </PostHogProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

```

---

## app/burrito.tsx

```tsx
import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { usePostHog } from 'posthog-react-native'
import { useAuth } from '../src/contexts/AuthContext'
import { colors, spacing, typography, borderRadius, shadows } from '../src/styles/theme'

/**
 * Burrito Consideration Screen
 *
 * Demonstrates PostHog event tracking with custom properties.
 * Each time the user considers a burrito, an event is captured.
 *
 * @see https://posthog.com/docs/libraries/react-native#capturing-events
 */
export default function BurritoScreen() {
  const { user, incrementBurritoConsiderations } = useAuth()
  const router = useRouter()
  const posthog = usePostHog()
  const [hasConsidered, setHasConsidered] = useState(false)

  // Redirect to home if not logged in
  useEffect(() => {
    if (!user) {
      router.replace('/')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleConsideration = async () => {
    const newCount = user.burritoConsiderations + 1

    // Update state first for immediate feedback
    await incrementBurritoConsiderations()
    setHasConsidered(true)

    // Hide success message after 2 seconds
    setTimeout(() => setHasConsidered(false), 2000)

    // Capture custom event in PostHog with properties
    // We recommend using a [object] [verb] format for event names
    // @see https://posthog.com/docs/libraries/react-native#capturing-events
    posthog.capture('burrito_considered', {
      total_considerations: newCount,
      username: user.username,
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Burrito Consideration Zone</Text>
        <Text style={styles.text}>
          Take a moment to truly consider the potential of burritos.
        </Text>

        {/*
          testID is captured by PostHog autocapture for touch events
          This helps identify the button in analytics
          @see https://posthog.com/docs/libraries/react-native#autocapture
        */}
        <TouchableOpacity
          style={styles.burritoButton}
          onPress={handleConsideration}
          activeOpacity={0.8}
          testID="consider-burrito-button"
        >
          <Text style={styles.burritoButtonText}>Consider Burrito</Text>
        </TouchableOpacity>

        {hasConsidered && (
          <View style={styles.successContainer}>
            <Text style={styles.success}>Thank you for your consideration!</Text>
            <Text style={styles.successCount}>Count: {user.burritoConsiderations}</Text>
          </View>
        )}

        <View style={styles.stats}>
          <Text style={styles.statsTitle}>Consideration Stats</Text>
          <Text style={styles.statsText}>Total considerations: {user.burritoConsiderations}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    ...shadows.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  burritoButton: {
    backgroundColor: colors.burrito,
    borderRadius: borderRadius.sm,
    padding: spacing.lg,
    alignItems: 'center',
    marginVertical: spacing.md,
    ...shadows.sm,
  },
  burritoButtonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  success: {
    color: colors.success,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  successCount: {
    color: colors.success,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
  },
  stats: {
    backgroundColor: colors.statsBackground,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginTop: spacing.lg,
  },
  statsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statsText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
})

```

---

## app/index.tsx

```tsx
import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../src/contexts/AuthContext'
import { colors, spacing, typography, borderRadius, shadows } from '../src/styles/theme'

export default function HomeScreen() {
  const { user, login, logout } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password')
      return
    }

    setIsSubmitting(true)
    try {
      const success = await login(username, password)
      if (success) {
        setUsername('')
        setPassword('')
      } else {
        setError('An error occurred during login')
      }
    } catch {
      setError('An error occurred during login')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Logged in view
  if (user) {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome back, {user.username}!</Text>
          <Text style={styles.text}>You are now logged in. Feel free to explore:</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.burritoButton]}
              onPress={() => router.push('/burrito')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Consider Burritos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push('/profile')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={logout}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }

  // Login view
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to Burrito Consideration App</Text>
          <Text style={styles.text}>Please sign in to begin your burrito journey</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter any username"
              placeholderTextColor={colors.textLight}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              editable={!isSubmitting}
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter any password"
              placeholderTextColor={colors.textLight}
              secureTextEntry
              autoComplete="password"
              editable={!isSubmitting}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{isSubmitting ? 'Signing In...' : 'Sign In'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.note}>
            Note: This is a demo app. Use any username and password to sign in.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    ...shadows.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  form: {
    marginTop: spacing.md,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: spacing.md,
  },
  buttonGroup: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  button: {
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  burritoButton: {
    backgroundColor: colors.burrito,
  },
  logoutButton: {
    backgroundColor: colors.danger,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.sm,
    fontSize: typography.sizes.sm,
  },
  note: {
    marginTop: spacing.lg,
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
})

```

---

## app/profile.tsx

```tsx
import { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { usePostHog } from 'posthog-react-native'
import { useAuth } from '../src/contexts/AuthContext'
import { colors, spacing, typography, borderRadius, shadows } from '../src/styles/theme'

/**
 * Profile Screen
 *
 * Displays user information and demonstrates PostHog error tracking.
 * The test error button shows how to capture exceptions manually.
 *
 * @see https://posthog.com/docs/libraries/react-native#error-tracking
 */
export default function ProfileScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const posthog = usePostHog()

  // Redirect to home if not logged in
  useEffect(() => {
    if (!user) {
      router.replace('/')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  /**
   * Triggers a test error and captures it in PostHog
   *
   * This demonstrates manual exception capture using the $exception event.
   * In production, you would typically set up automatic exception capture
   * or use the before_send callback for customization.
   *
   * @see https://posthog.com/docs/libraries/react-native#error-tracking
   */
  const triggerTestError = () => {
    try {
      throw new Error('Test error for PostHog error tracking')
    } catch (err) {
      const error = err as Error

      // Capture exception in PostHog
      // @see https://posthog.com/docs/error-tracking
      posthog.capture('$exception', {
        $exception_list: [
          {
            type: error.name,
            value: error.message,
            stacktrace: {
              type: 'raw',
              frames: error.stack ?? '',
            },
          },
        ],
        $exception_source: 'react-native',
        // Additional context
        username: user.username,
        screen: 'Profile',
      })

      console.error('Captured error:', error)
      Alert.alert('Error Captured', 'The test error has been sent to PostHog!', [{ text: 'OK' }])
    }
  }

  const getJourneyMessage = () => {
    const count = user.burritoConsiderations
    if (count === 0) {
      return "You haven't considered any burritos yet. Visit the Burrito Consideration page to start!"
    } else if (count === 1) {
      return "You've considered the burrito potential once. Keep going!"
    } else if (count < 5) {
      return "You're getting the hang of burrito consideration!"
    } else if (count < 10) {
      return "You're becoming a burrito consideration expert!"
    } else {
      return 'You are a true burrito consideration master!'
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>User Profile</Text>

        <View style={styles.stats}>
          <Text style={styles.statsTitle}>Your Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Username:</Text>
            <Text style={styles.infoValue}>{user.username}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Burrito Considerations:</Text>
            <Text style={styles.infoValue}>{user.burritoConsiderations}</Text>
          </View>
        </View>

        {/*
          testID is captured by PostHog autocapture for touch events
          @see https://posthog.com/docs/libraries/react-native#autocapture
        */}
        <TouchableOpacity
          style={styles.errorButton}
          onPress={triggerTestError}
          activeOpacity={0.8}
          testID="trigger-error-button"
        >
          <Text style={styles.buttonText}>Trigger Test Error (for PostHog)</Text>
        </TouchableOpacity>

        <View style={styles.journey}>
          <Text style={styles.journeyTitle}>Your Burrito Journey</Text>
          <Text style={styles.journeyText}>{getJourneyMessage()}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    ...shadows.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  stats: {
    backgroundColor: colors.statsBackground,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  statsTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  infoLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginRight: spacing.xs,
  },
  infoValue: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  errorButton: {
    backgroundColor: colors.danger,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  journey: {
    marginTop: spacing.lg,
  },
  journeyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  journeyText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: 24,
  },
})

```

---

## babel.config.js

```js
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['babel-plugin-react-compiler'],
      'react-native-reanimated/plugin', // Must be last
    ],
  }
}

```

---

## src/config/posthog.ts

```ts
import PostHog from 'posthog-react-native'
import Constants from 'expo-constants'

// Configuration loaded from app.config.js extras via expo-constants
// Environment variables are read at build time in app.config.js
const apiKey = Constants.expoConfig?.extra?.posthogProjectToken as string | undefined
const host = (Constants.expoConfig?.extra?.posthogHost as string) || 'https://us.i.posthog.com'
const isPostHogConfigured = apiKey && apiKey !== 'phc_your_project_token_here'

if (__DEV__) {
  console.log('PostHog config:', {
    apiKey: apiKey ? `SET` : 'NOT SET',
    host,
    isConfigured: isPostHogConfigured,
  })
}

if (!isPostHogConfigured) {
  console.warn(
    'PostHog project token not configured. Analytics will be disabled. ' +
      'Set POSTHOG_PROJECT_TOKEN in your .env file to enable analytics.'
  )
}

/**
 * PostHog client instance for Expo
 *
 * Configuration loaded from app.config.js extras via expo-constants.
 * Required peer dependencies: expo-file-system, expo-application,
 * expo-device, expo-localization
 *
 * For React Native Web targets, use @react-native-async-storage/async-storage
 * instead of expo-file-system (Web and macOS targets not supported by expo-file-system).
 *
 * @see https://posthog.com/docs/libraries/react-native
 */
export const posthog = new PostHog(apiKey || 'placeholder_key', {
  // PostHog API host
  host,

  // Disable PostHog if project token is not configured
  disabled: !isPostHogConfigured,

  // Capture app lifecycle events:
  // - Application Installed, Application Updated
  // - Application Opened, Application Became Active, Application Backgrounded
  captureAppLifecycleEvents: true,

  // Enable debug mode in development for verbose logging
  debug: __DEV__,

  // Batching: queue events and flush periodically to optimize battery usage
  flushAt: 20,              // Number of events to queue before sending
  flushInterval: 10000,     // Interval in ms between periodic flushes
  maxBatchSize: 100,        // Maximum events per batch
  maxQueueSize: 1000,       // Maximum queued events (oldest dropped when full)

  // Feature flags
  preloadFeatureFlags: true,        // Load flags on initialization
  sendFeatureFlagEvent: true,       // Track getFeatureFlag calls for experiments
  featureFlagsRequestTimeoutMs: 10000, // Timeout for flag requests (prevents blocking)

  // Network settings
  requestTimeout: 10000,    // General request timeout in ms
  fetchRetryCount: 3,       // Number of retry attempts for failed requests
  fetchRetryDelay: 3000,    // Delay between retries in ms
})

export const isPostHogEnabled = isPostHogConfigured

```

---

## src/contexts/AuthContext.tsx

```tsx
import React, { createContext, useState, useEffect, use } from 'react'
import type { ReactNode } from 'react'
import { usePostHog } from 'posthog-react-native'
import { storage } from '../services/storage'
import type { User } from '../services/storage'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  incrementBurritoConsiderations: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const posthog = usePostHog()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUsername = await storage.getCurrentUser()
        if (storedUsername) {
          const existingUser = await storage.getUser(storedUsername)
          if (existingUser) {
            setUser(existingUser)
            posthog.identify(storedUsername, {
              $set: { username: storedUsername },
            })
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error)
      } finally {
        setIsLoading(false)
      }
    }
    restoreSession()
  }, [posthog])

  // React Compiler auto-memoizes these callbacks - no useCallback needed!
  const login = async (username: string, password: string): Promise<boolean> => {
    if (!username.trim() || !password.trim()) {
      return false
    }

    try {
      const existingUser = await storage.getUser(username)
      const isNewUser = !existingUser

      const userData: User = existingUser || {
        username,
        burritoConsiderations: 0,
      }

      await storage.saveUser(userData)
      await storage.setCurrentUser(username)
      setUser(userData)

      posthog.identify(username, {
        $set: { username },
        $set_once: { first_login_date: new Date().toISOString() },
      })

      posthog.capture('user_logged_in', {
        username,
        is_new_user: isNewUser,
      })

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    posthog.capture('user_logged_out')
    posthog.reset()
    await storage.removeCurrentUser()
    setUser(null)
  }

  const incrementBurritoConsiderations = async () => {
    if (user) {
      const updatedUser: User = {
        ...user,
        burritoConsiderations: user.burritoConsiderations + 1,
      }
      setUser(updatedUser)
      await storage.saveUser(updatedUser)
    }
  }

  return (
    <AuthContext
      value={{
        user,
        isLoading,
        login,
        logout,
        incrementBurritoConsiderations,
      }}
    >
      {children}
    </AuthContext>
  )
}

/**
 * React 19: Use the `use` API instead of useContext
 * - Can be called conditionally (unlike useContext)
 * - Enables more flexible component composition
 */
export function useAuth() {
  const context = use(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

```

---

## src/services/storage.ts

```ts
import AsyncStorage from '@react-native-async-storage/async-storage'

const CURRENT_USER_KEY = 'currentUser'
const USERS_KEY = 'users'

export interface User {
  username: string
  burritoConsiderations: number
}

/**
 * Storage service for persisting user data
 * Uses AsyncStorage (React Native's async key-value storage)
 */
export const storage = {
  /**
   * Get the currently logged in user's username
   */
  getCurrentUser: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(CURRENT_USER_KEY)
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  /**
   * Set the currently logged in user's username
   */
  setCurrentUser: async (username: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, username)
    } catch (error) {
      console.error('Error setting current user:', error)
    }
  },

  /**
   * Remove the current user (logout)
   */
  removeCurrentUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY)
    } catch (error) {
      console.error('Error removing current user:', error)
    }
  },

  /**
   * Get all stored users
   */
  getUsers: async (): Promise<Record<string, User>> => {
    try {
      const data = await AsyncStorage.getItem(USERS_KEY)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Error getting users:', error)
      return {}
    }
  },

  /**
   * Get a specific user by username
   */
  getUser: async (username: string): Promise<User | null> => {
    try {
      const users = await storage.getUsers()
      return users[username] || null
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  },

  /**
   * Save a user to storage
   */
  saveUser: async (user: User): Promise<void> => {
    try {
      const users = await storage.getUsers()
      users[user.username] = user
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users))
    } catch (error) {
      console.error('Error saving user:', error)
    }
  },

  /**
   * Clear all stored data (for testing/debugging)
   */
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([CURRENT_USER_KEY, USERS_KEY])
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  },
}

```

---

## src/styles/theme.ts

```ts
/**
 * Theme constants for consistent styling across the app
 * Matches the color scheme from the TanStack Start web version
 */

export const colors = {
  // Primary colors
  primary: '#0070f3',
  primaryDark: '#0051cc',

  // Status colors
  success: '#28a745',
  successDark: '#218838',
  danger: '#dc3545',
  dangerDark: '#c82333',

  // Feature colors
  burrito: '#e07c24',
  burritoDark: '#c96a1a',

  // Neutral colors
  background: '#f5f5f5',
  white: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#dddddd',
  borderLight: '#eeeeee',

  // Component-specific
  statsBackground: '#f8f9fa',
  headerBackground: '#333333',
  headerText: '#ffffff',
  inputBackground: '#ffffff',
  cardBackground: '#ffffff',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
}

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
}

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
}

```

---

