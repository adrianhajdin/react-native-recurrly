---
name: integration-expo
description: PostHog integration for Expo applications
metadata:
  author: PostHog
  version: 1.9.4
---

# PostHog integration for Expo

This skill helps you add PostHog analytics to Expo applications.

## Workflow

Follow these steps in order to complete the integration:

1. `basic-integration-1.0-begin.md` - PostHog Setup - Begin ← **Start here**
2. `basic-integration-1.1-edit.md` - PostHog Setup - Edit
3. `basic-integration-1.2-revise.md` - PostHog Setup - Revise
4. `basic-integration-1.3-conclude.md` - PostHog Setup - Conclusion

## Reference files

- `references/EXAMPLE.md` - Expo example project code
- `references/react-native.md` - React native - docs
- `references/identify-users.md` - Identify users - docs
- `references/basic-integration-1.0-begin.md` - PostHog setup - begin
- `references/basic-integration-1.1-edit.md` - PostHog setup - edit
- `references/basic-integration-1.2-revise.md` - PostHog setup - revise
- `references/basic-integration-1.3-conclude.md` - PostHog setup - conclusion

The example project shows the target implementation pattern. Consult the documentation for API details.

## Key principles

- **Environment variables**: Always use environment variables for PostHog keys. Never hardcode them.
- **Minimal changes**: Add PostHog code alongside existing integrations. Don't replace or restructure existing code.
- **Match the example**: Your implementation should follow the example project's patterns as closely as possible.

## Framework guidelines

- posthog-react-native is the React Native SDK package name (same as bare RN)
- Use expo-constants with app.config.js extras for POSTHOG_PROJECT_TOKEN and POSTHOG_HOST (NOT react-native-config)
- Access config via `Constants.expoConfig?.extra?.posthogProjectToken` in your posthog.ts config file
- For expo-router, wrap PostHogProvider in app/_layout.tsx and manually track screens with `posthog.screen(pathname, params)` in a useEffect
- react-native-svg is a required peer dependency of posthog-react-native (used by the surveys feature) and must be installed alongside it
- Place PostHogProvider INSIDE NavigationContainer for React Navigation v7 compatibility

## Identifying users

Identify users during login and signup events. Refer to the example code and documentation for the correct identify pattern for this framework. If both frontend and backend code exist, pass the client-side session and distinct ID using `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to maintain correlation.

## Error tracking

Add PostHog error tracking to relevant files, particularly around critical user flows and API boundaries.
