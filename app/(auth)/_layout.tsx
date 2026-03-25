import { Stack, Redirect } from "expo-router";
import { useAuth } from '@clerk/expo';
import '@/global.css';

export default function AuthLayout() {
    const { isSignedIn, isLoaded } = useAuth();

    // Wait for auth to load before rendering anything
    if (!isLoaded) {
        return null;
    }

    // Redirect to home if user is already signed in
    if (isSignedIn) {
        return <Redirect href="/(tabs)" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
