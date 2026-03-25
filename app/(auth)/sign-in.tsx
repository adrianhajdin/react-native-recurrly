import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter, type Href } from 'expo-router';
import { useSignIn } from '@clerk/expo';
import { useState } from 'react';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';

const SafeAreaView = styled(RNSafeAreaView);

const SignIn = () => {
    const { signIn, errors, fetchStatus } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    // Validation states
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    // Client-side validation
    const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
    const passwordValid = password.length === 0 || password.length > 0;
    const formValid = emailAddress.length > 0 && password.length > 0 && emailValid;

    const handleSubmit = async () => {
        if (!formValid) return;

        const { error } = await signIn.password({
            emailAddress,
            password,
        });

        if (error) {
            console.error(JSON.stringify(error, null, 2));
            return;
        }

        if (signIn.status === 'complete') {
            await signIn.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session?.currentTask);
                        return;
                    }

                    const url = decorateUrl('/(tabs)');
                    if (url.startsWith('http')) {
                        window.location.href = url;
                    } else {
                        router.replace(url as Href);
                    }
                },
            });
        } else if (signIn.status === 'needs_second_factor') {
            // Handle MFA if needed (not implemented in this basic flow)
            console.log('MFA required');
        } else if (signIn.status === 'needs_client_trust') {
            // Send email code for client trust verification
            const emailCodeFactor = signIn.supportedSecondFactors.find(
                (factor) => factor.strategy === 'email_code'
            );

            if (emailCodeFactor) {
                await signIn.mfa.sendEmailCode();
            }
        } else {
            console.error('Sign-in attempt not complete:', signIn);
        }
    };

    const handleVerify = async () => {
        await signIn.mfa.verifyEmailCode({ code });

        if (signIn.status === 'complete') {
            await signIn.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session?.currentTask);
                        return;
                    }

                    const url = decorateUrl('/(tabs)');
                    if (url.startsWith('http')) {
                        window.location.href = url;
                    } else {
                        router.replace(url as Href);
                    }
                },
            });
        } else {
            console.error('Sign-in attempt not complete:', signIn);
        }
    };

    // Show verification screen if client trust is needed
    if (signIn.status === 'needs_client_trust') {
        return (
            <SafeAreaView className="auth-safe-area">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="auth-screen"
                >
                    <ScrollView
                        className="auth-scroll"
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="auth-content">
                            {/* Branding */}
                            <View className="auth-brand-block">
                                <View className="auth-logo-wrap">
                                    <View className="auth-logo-mark">
                                        <Text className="auth-logo-mark-text">R</Text>
                                    </View>
                                    <View>
                                        <Text className="auth-wordmark">Recurrly</Text>
                                        <Text className="auth-wordmark-sub">SUBSCRIPTIONS</Text>
                                    </View>
                                </View>
                                <Text className="auth-title">Verify your identity</Text>
                                <Text className="auth-subtitle">
                                    We sent a verification code to your email
                                </Text>
                            </View>

                            {/* Verification Form */}
                            <View className="auth-card">
                                <View className="auth-form">
                                    <View className="auth-field">
                                        <Text className="auth-label">Verification Code</Text>
                                        <TextInput
                                            className="auth-input"
                                            value={code}
                                            placeholder="Enter 6-digit code"
                                            placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                            onChangeText={setCode}
                                            keyboardType="number-pad"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                        />
                                        {errors.fields.code && (
                                            <Text className="auth-error">{errors.fields.code.message}</Text>
                                        )}
                                    </View>

                                    <Pressable
                                        className={`auth-button ${(!code || fetchStatus === 'fetching') && 'auth-button-disabled'}`}
                                        onPress={handleVerify}
                                        disabled={!code || fetchStatus === 'fetching'}
                                    >
                                        <Text className="auth-button-text">
                                            {fetchStatus === 'fetching' ? 'Verifying...' : 'Verify'}
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        className="auth-secondary-button"
                                        onPress={() => signIn.mfa.sendEmailCode()}
                                        disabled={fetchStatus === 'fetching'}
                                    >
                                        <Text className="auth-secondary-button-text">Resend Code</Text>
                                    </Pressable>

                                    <Pressable
                                        className="auth-secondary-button"
                                        onPress={() => signIn.reset()}
                                        disabled={fetchStatus === 'fetching'}
                                    >
                                        <Text className="auth-secondary-button-text">Start Over</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    // Main sign-in form
    return (
        <SafeAreaView className="auth-safe-area">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="auth-screen"
            >
                <ScrollView
                    className="auth-scroll"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="auth-content">
                        {/* Branding */}
                        <View className="auth-brand-block">
                            <View className="auth-logo-wrap">
                                <View className="auth-logo-mark">
                                    <Text className="auth-logo-mark-text">R</Text>
                                </View>
                                <View>
                                    <Text className="auth-wordmark">Recurrly</Text>
                                    <Text className="auth-wordmark-sub">SUBSCRIPTIONS</Text>
                                </View>
                            </View>
                            <Text className="auth-title">Welcome back</Text>
                            <Text className="auth-subtitle">
                                Sign in to continue managing your subscriptions
                            </Text>
                        </View>

                        {/* Sign-In Form */}
                        <View className="auth-card">
                            <View className="auth-form">
                                <View className="auth-field">
                                    <Text className="auth-label">Email Address</Text>
                                    <TextInput
                                        className={`auth-input ${emailTouched && !emailValid && 'auth-input-error'}`}
                                        autoCapitalize="none"
                                        value={emailAddress}
                                        placeholder="name@example.com"
                                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                        onChangeText={setEmailAddress}
                                        onBlur={() => setEmailTouched(true)}
                                        keyboardType="email-address"
                                        autoComplete="email"
                                    />
                                    {emailTouched && !emailValid && (
                                        <Text className="auth-error">Please enter a valid email address</Text>
                                    )}
                                    {errors.fields.identifier && (
                                        <Text className="auth-error">{errors.fields.identifier.message}</Text>
                                    )}
                                </View>

                                <View className="auth-field">
                                    <Text className="auth-label">Password</Text>
                                    <TextInput
                                        className={`auth-input ${passwordTouched && !passwordValid && 'auth-input-error'}`}
                                        value={password}
                                        placeholder="Enter your password"
                                        placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                        secureTextEntry
                                        onChangeText={setPassword}
                                        onBlur={() => setPasswordTouched(true)}
                                        autoComplete="password"
                                    />
                                    {passwordTouched && !passwordValid && (
                                        <Text className="auth-error">Password is required</Text>
                                    )}
                                    {errors.fields.password && (
                                        <Text className="auth-error">{errors.fields.password.message}</Text>
                                    )}
                                </View>

                                <Pressable
                                    className={`auth-button ${(!formValid || fetchStatus === 'fetching') && 'auth-button-disabled'}`}
                                    onPress={handleSubmit}
                                    disabled={!formValid || fetchStatus === 'fetching'}
                                >
                                    <Text className="auth-button-text">
                                        {fetchStatus === 'fetching' ? 'Signing In...' : 'Sign In'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Sign-Up Link */}
                        <View className="auth-link-row">
                            <Text className="auth-link-copy">Don't have an account?</Text>
                            <Link href="/(auth)/sign-up" asChild>
                                <Pressable>
                                    <Text className="auth-link">Create Account</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignIn;
