import {SplashScreen, Stack, usePathname, useGlobalSearchParams} from "expo-router";
import '@/global.css';
import {useFonts} from "expo-font";
import {useEffect, useRef} from "react";
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { PostHogProvider } from 'posthog-react-native';
import { posthog } from '../src/config/posthog';

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

function RootLayoutContent() {
  const { isLoaded: authLoaded } = useAuth();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      // Filter route params to avoid leaking sensitive data
      const sanitizedParams = Object.keys(params).reduce((acc, key) => {
        // Only include specific safe params
        if (['id', 'tab', 'view'].includes(key)) {
          acc[key] = params[key];
        }
        return acc;
      }, {} as Record<string, string | string[]>);

      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...sanitizedParams,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')
  })

  useEffect(() => {
    // Hide splash only when both fonts and auth are loaded
    if (fontsLoaded && authLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, authLoaded])

  // Don't render app until both are ready
  if (!fontsLoaded || !authLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ['testID'],
      }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <RootLayoutContent />
      </ClerkProvider>
    </PostHogProvider>
  );
}
