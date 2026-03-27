# React Native - Docs

## Installation

Our React Native enables you to integrate PostHog with your React Native project. For React Native projects built with Expo, there are no mobile native dependencies outside of supported Expo packages.

To install, add the `posthog-react-native` package to your project as well as the required peer dependencies.

### Expo apps

Terminal

PostHog AI

```bash
npx expo install posthog-react-native expo-file-system expo-application expo-device expo-localization
```

### React Native apps

Terminal

PostHog AI

```bash
yarn add posthog-react-native @react-native-async-storage/async-storage react-native-device-info react-native-localize
# or
npm i -s posthog-react-native @react-native-async-storage/async-storage react-native-device-info react-native-localize
```

### React Native Web and macOS

If you're using [React Native Web](https://github.com/necolas/react-native-web) or [React Native macOS](https://github.com/microsoft/react-native-macos), do not use the [expo-file-system](https://github.com/expo/expo/tree/master/packages/expo-file-system) package since the Web and macOS targets aren't supported, use the [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) package instead.

### Configuration

#### With the PosthogProvider

The recommended way to set up PostHog for React Native is to use the `PostHogProvider`. This utilizes the Context API to pass the PostHog client around, and enables [autocapture](/docs/product-analytics/autocapture.md).

To set up `PostHogProvider`, add it to your `App.js` or `App.ts` file:

App.js

PostHog AI

```jsx
// App.(js|ts)
import { usePostHog, PostHogProvider } from 'posthog-react-native'
...
export function MyApp() {
    return (
        <PostHogProvider apiKey="<ph_project_token>" options={{
            // usually 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'
            host: 'https://us.i.posthog.com',
        }}>
            <MyComponent />
        </PostHogProvider>
    )
}
```

Then you can access PostHog using the `usePostHog()` hook:

React Native

PostHog AI

```jsx
const MyComponent = () => {
    const posthog = usePostHog()
    useEffect(() => {
        posthog.capture("event_name")
    }, [posthog])
}
```

#### Without the PosthogProvider

If you prefer not to use the provider, you can initialize PostHog in its own file and import the instance from there:

posthog.ts

PostHog AI

```jsx
import PostHog from 'posthog-react-native'
export const posthog = new PostHog('<ph_project_token>', {
  // usually 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'
  host: 'https://us.i.posthog.com'
})
```

Then you can access PostHog by importing your instance:

React Native

PostHog AI

```jsx
import { posthog } from './posthog'
export function MyApp1() {
    useEffect(() => {
        posthog.capture('event_name')
    }, [])
    return <View>Your app code</View>
}
```

You can even use this instance with the PostHogProvider:

React Native

PostHog AI

```jsx
import { posthog } from './posthog'
export function MyApp() {
  return <PostHogProvider client={posthog}>{/* Your app code */}</PostHogProvider>
}
```

Set up a reverse proxy (recommended)

We recommend [setting up a reverse proxy](/docs/advanced/proxy.md), so that events are less likely to be intercepted by tracking blockers.

We have our [own managed reverse proxy service](/docs/advanced/proxy/managed-reverse-proxy.md), which is free for all PostHog Cloud users, routes through our infrastructure, and makes setting up your proxy easy.

If you don't want to use our managed service then there are several other options for creating a reverse proxy, including using [Cloudflare](/docs/advanced/proxy/cloudflare.md), [AWS Cloudfront](/docs/advanced/proxy/cloudfront.md), and [Vercel](/docs/advanced/proxy/vercel.md).

Grouping products in one project (recommended)

If you have multiple customer-facing products (e.g. a marketing website + mobile app + web app), it's best to install PostHog on them all and [group them in one project](/docs/settings/projects.md).

This makes it possible to track users across their entire journey (e.g. from visiting your marketing website to signing up for your product), or how they use your product across multiple platforms.

Add IPs to Firewall/WAF allowlists (recommended)

For certain features like [heatmaps](/docs/toolbar/heatmaps.md), your Web Application Firewall (WAF) may be blocking PostHog’s requests to your site. Add these IP addresses to your WAF allowlist or rules to let PostHog access your site.

**EU**: `3.75.65.221`, `18.197.246.42`, `3.120.223.253`

**US**: `44.205.89.55`, `52.4.194.122`, `44.208.188.173`

These are public, stable IPs used by PostHog services (e.g., Celery tasks for snapshots).

### Configuration options

You can further customize how PostHog works through its configuration on initialization.

| Attribute | Description |
| --- | --- |
| hostType: StringDefault: https://us.i.posthog.com | PostHog API host (usually https://us.i.posthog.com by default or https://eu.i.posthog.com). Host is optional if you use https://us.i.posthog.com. |
| flushAtType: NumberDefault: 20 | The number of events to queue before sending to PostHog (flushing). |
| flushIntervalType: NumberDefault: 10000 | The interval in milliseconds between periodic flushes. |
| maxBatchSizeType: NumberDefault: 100 | The maximum number of queued messages to be flushed as part of a single batch (must be higher than flushAt). |
| maxQueueSizeType: NumberDefault: 1000 | The maximum number of cached messages either in memory or on the local storage (must be higher than flushAt). |
| disabledType: BooleanDefault: false | If set to true, the SDK is essentially disabled (useful for local environments where you don't want to track anything). |
| defaultOptInType: BooleanDefault: true | If set to false, the SDK will not track until the optIn() function is called. |
| sendFeatureFlagEventType: BooleanDefault: true | Whether to track that getFeatureFlag was called (used by experiments). |
| preloadFeatureFlagsType: BooleanDefault: true | Whether to load feature flags when initialized or not. |
| bootstrapType: ObjectDefault: {} | An object containing the distinctId, isIdentifiedId, featureFlags, and featureFlagPayloads keys. distinctId is a string, and featureFlags and featureFlagPayloads are objects of key-value pairs. Used to ensure data is available as soon as the SDK loads. |
| fetchRetryCountType: NumberDefault: 3 | How many times HTTP requests will be retried. |
| fetchRetryDelayType: NumberDefault: 3000 | The delay between HTTP request retries. |
| requestTimeoutType: NumberDefault: 10000 | Timeout in milliseconds for any calls. |
| featureFlagsRequestTimeoutMsType: NumberDefault: 10000 | Timeout in milliseconds for feature flag calls. |
| sessionExpirationTimeSecondsType: NumberDefault: 1800 | For session analysis, how long before a session expires (defaults to 30 minutes). |
| persistenceType: StringDefault: file | Allows you to provide the storage type. file will try to load the best available storage, the provided customStorage, customAsyncStorage, or in-memory storage. |
| customAppPropertiesType: Object or FunctionDefault: null | Allows you to provide your own implementation of the common information about your App or a function to modify the default App properties generated. |
| customStorageType: ObjectDefault: null | Allows you to provide a custom asynchronous storage such as async-storage, expo-file-system, or a synchronous storage such as mmkv. If not provided, PostHog will attempt to use the best available storage via optional peer dependencies. If persistence is set to memory, this option is ignored. |
| captureAppLifecycleEventsType: BooleanDefault: false | Captures app lifecycle events such as Application Installed, Application Updated, Application Opened, Application Became Active, and Application Backgrounded. By default, this is false. |
| disableGeoipType: BooleanDefault: false | When true, disables automatic GeoIP resolution for events and feature flags. |
| enableSessionReplayType: BooleanDefault: false | Enable Recording of Session replay for Android and iOS. |
| sessionReplayConfigType: ObjectDefault: null | Session replay configuration. See the [replay install docs](/docs/session-replay/installation.md) for more details. |
| enablePersistSessionIdAcrossRestartType: BooleanDefault: false | When true, persists the $session_id across app restarts. If false, $session_id always resets on app restart. |
| evaluationContextsType: Array of StringsDefault: undefined | Evaluation context tags that constrain which feature flags are evaluated. When set, only flags with matching evaluation context tags (or no evaluation context tags) will be returned. This helps reduce unnecessary flag evaluations and improves performance. See [evaluation contexts documentation](/docs/feature-flags/evaluation-contexts.md) for more details. Available in version 4.8.0+. The legacy parameter evaluationEnvironments (version 4.7.2+) is also supported for backward compatibility. |
| before_sendType: FunctionDefault: undefined | A callback function that is called before each event is sent to PostHog. You can use it to modify, filter, or suppress events. Return null to drop the event, or return the modified event to send it. See [customizing exception capture](#customizing-exception-capture-with-before_send) for details. |

## Capturing events

You can send custom events using `capture`:

React Native

PostHog AI

```jsx
posthog.capture('user_signed_up')
```

> **Tip:** We recommend using a `[object] [verb]` format for your event names, where `[object]` is the entity that the behavior relates to, and `[verb]` is the behavior itself. For example, `project created`, `user signed up`, or `invite sent`.

### Setting event properties

Optionally, you can include additional information with the event by including a [properties](/docs/data/events.md#event-properties) object:

React Native

PostHog AI

```jsx
posthog.capture('user_signed_up', {
    login_type: "email",
    is_free_trial: true
})
```

### Capturing screen views

#### With `@react-navigation/native` and autocapture:

When using [@react-navigation/native](https://reactnavigation.org/docs/6.x/getting-started) v6 or lower, screen tracking is automatically captured if the [`autocapture`](/docs/libraries/react-native.md#autocapture) property is used in the `PostHogProvider`:

It is important that the `PostHogProvider` is configured as a child of the `NavigationContainer`:

React Native

PostHog AI

```jsx
// App.(js|ts)
import { PostHogProvider } from 'posthog-react-native'
import { NavigationContainer } from '@react-navigation/native'
export function App() {
    return (
        <NavigationContainer>
            <PostHogProvider apiKey="<ph_project_token>" autocapture>
                {/* Rest of app */}
            </PostHogProvider>
        </NavigationContainer>
    )
}
```

When using [@react-navigation/native](https://reactnavigation.org/docs/7.x/getting-started) v7 or higher, screen tracking has to be manually captured:

React Native

PostHog AI

```jsx
// App.(js|ts)
import { PostHogProvider } from 'posthog-react-native'
import { NavigationContainer } from '@react-navigation/native'
// Using `PostHogProvider` is optional, but needed if you want to capture touch events automatically with the `captureTouches` option.
export function App() {
    return (
        <NavigationContainer>
            <PostHogProvider apiKey="<ph_project_token>" autocapture={{
              captureScreens: false, // Screen events are handled differently for v7 and higher
              captureTouches: true,
            }}>
                {/* Rest of app */}
            </PostHogProvider>
        </NavigationContainer>
    )
}
```

Check out and set it up the official way for [Screen tracking for analytics](https://reactnavigation.org/docs/screen-tracking/).

Then call the `screen` method within the `trackScreenView` method.

React Native

PostHog AI

```jsx
const posthog = usePostHog() // use the usePostHog hook if using the PostHogProvider or your own custom posthog instance
// you can read the params from `getCurrentRoute()`
posthog.screen(currentRouteName, params)
```

#### With `react-native-navigation` and autocapture:

First, simplify the wrapping of your screens with a shared PostHogProvider:

React Native

PostHog AI

```jsx
import PostHog, { PostHogProvider } from 'posthog-react-native'
import { Navigation } from 'react-native-navigation';
export const posthog = new PostHog('<ph_project_token>');
export const SharedPostHogProvider = (props: any) => {
  return (
    <PostHogProvider client={posthog} autocapture={{
      captureScreens: false, // Screen events are handled differently for react-native-navigation
      captureTouches: true,
    }}>
      {props.children}
    </PostHogProvider>
  );
};
```

Then, every screen needs to be wrapped with this provider if you want to capture touches or use the `usePostHog()` hook

React Native

PostHog AI

```jsx
export const MyScreen = () => {
  return (
    <SharedPostHogProvider>
      <View>
        ...
      </View>
    </SharedPostHogProvider>
  );
};
Navigation.registerComponent('Screen', () => MyScreen);
Navigation.events().registerAppLaunchedListener(async () => {
  posthog.initReactNativeNavigation({
    navigation: {
      // (Optional) Set the name based on the route. Defaults to the route name.
      routeToName: (name, properties) => name,
      // (Optional) Tracks all passProps as properties. Defaults to undefined
      routeToProperties: (name, properties) => properties,
    },
    captureScreens: true,
  });
});
```

#### With `expo-router`:

Check out and set it up the official way for [Screen tracking for analytics](https://docs.expo.dev/router/reference/screen-tracking/).

Then call the `screen` method within the `useEffect` callback.

React Native

PostHog AI

```jsx
const posthog = usePostHog() // use the usePostHog hook if using the PostHogProvider or your own custom posthog instance
posthog.screen(pathname, params)
```

#### Manually capturing screen capture events

If you prefer not to use autocapture, you can manually capture screen views by calling `posthog.screen()`. This function requires a `name`. You may also pass in an optional `properties` object.

JavaScript

PostHog AI

```javascript
posthog.screen('dashboard', {
    background: 'blue',
    hero: 'superhog',
})
```

## Autocapture

PostHog autocapture can automatically track the following events for you:

-   **Application Opened** - when the app is opened from a closed state
-   **Application Became Active** - when the app comes to the foreground (e.g. from the app switcher)
-   **Application Backgrounded** - when the app is sent to the background by the user
-   **Application Installed** - when the app is installed.
-   **Application Updated** - when the app is updated.
-   **$screen** - when the user navigates (if using `@react-navigation/native` (v6 or lower) or `react-native-navigation`), check out the [capturing screen views](/docs/libraries/react-native.md#capturing-screen-views) section
-   **$autocapture** - touch events when the user interacts with the screen
-   **$exception** - when the app throws exceptions.

> ⚠️ **React Navigation v7 users**
>
> React Navigation v7 restricts navigation hooks (such as `useNavigationState`) to components rendered inside a Screen that belongs to a Navigator.
>
> Because of this change, automatic screen tracking may throw errors if PostHog is initialized outside a screen context. This commonly affects apps upgrading from React Navigation v6 to v7.
>
> For React Navigation v7, we recommend disabling automatic screen capture for screens and manually calling `posthog.screen()` inside each screen component. See the [Capturing screen views](/docs/libraries/react-native.md#capturing-screen-views) section below.

With autocapture, all touch events for children of `PosthogProvider` are tracked, capturing a snapshot of the view hierarchy at that point. This enables you to create [insights](/docs/product-analytics/insights.md) in PostHog without having to add custom events.

PostHog will try to generate a sensible name for the touched element based on the React component `displayName` or `name`. If you prefer, you can set your own name using the `ph-label` prop:

React Native

PostHog AI

```jsx
<View ph-label="my-special-label"></View>
```

### Autocapture configuration

React Native

PostHog AI

```jsx
<PostHogProvider apiKey="<ph_project_token>" autocapture={{
    captureTouches: true,
    captureScreens: true,
    ignoreLabels: [], // Any labels here will be ignored from the stack in touch events
    customLabelProp: "ph-label",
    maxElementsCaptured: 20,
    noCaptureProp: "ph-no-capture",
    propsToCapture: ["testID"], // Limit which props are captured. By default, identifiers and text content are captured.
    navigation: {
        // By default, only the screen name is tracked but it is possible to track the
        // params or modify the name by intercepting the autocapture like so
        routeToName: (name, params) => {
            if (params.id) return `${name}/${params.id}`
            return name
        },
        routeToProperties: (name, params) => {
            if (name === "SensitiveScreen") return undefined
            return params
        },
    },
}}>
    ...
</PostHogProvider>
```

### Preventing sensitive data capture

If there are elements you don't want to be captured, you can add the `ph-no-capture` property. If this property is found anywhere in the view hierarchy, the entire touch event is ignored:

React Native

PostHog AI

```jsx
<View ph-no-capture>Sensitive view here</View>
```

## Identifying users

> We highly recommend reading our section on [Identifying users](/docs/integrate/identifying-users.md) to better understand how to correctly use this method.

Using `identify`, you can associate events with specific users. This enables you to gain full insights as to how they're using your product across different sessions, devices, and platforms.

An `identify` call has the following arguments:

-   **distinctId:** Required. A unique identifier for your user. Typically either their email or database ID.
-   **properties:** Optional. A dictionary with key:value pairs to set the [person properties](/docs/product-analytics/person-properties.md)

React Native

PostHog AI

```jsx
posthog.identify('distinctID',
  { // ($set):
      email: 'user@posthog.com',
      name: 'My Name'
  }
)
```

`$set_once` works just like `$set`, except that it will **only set the property if the user doesn't already have that property set**. [See the difference between `$set` and `$set_once`](/docs/product-analytics/person-properties.md#what-is-the-difference-between-set-and-set_once)

React Native

PostHog AI

```jsx
posthog.identify('distinctID',
  {
    $set: {
        email: 'user@posthog.com',
        name: 'My Name'
    },
    $set_once: {
        date_of_first_log_in: '2024-03-01'
    }
  }
)
```

You should call `identify` as soon as you're able to. Typically, this is after your user logs in. This ensures that events sent during your user's sessions are correctly associated with them.

When you call `identify`, all previously tracked [anonymous events](/docs/data/anonymous-vs-identified-events.md) will be linked to the user.

## Get the current user's distinct ID

You may find it helpful to get the current user's distinct ID. For example, to check whether you've already called `identify` for a user or not.

To do this, call `posthog.get_distinct_id()`. This returns either the ID automatically generated by PostHog or the ID that has been passed by a call to `identify()`.

## Alias

Sometimes, you want to assign multiple distinct IDs to a single user. This is helpful when your primary distinct ID is inaccessible. For example, if a distinct ID used on the frontend is not available in your backend.

In this case, you can use `alias` to assign another distinct ID to the same user.

React Native

PostHog AI

```jsx
// Sets alias for current user
posthog.alias('distinct_id')
```

We strongly recommend reading our docs on [alias](/docs/data/identify.md#alias-assigning-multiple-distinct-ids-to-the-same-user) to best understand how to correctly use this method.

## Setting person properties

Person properties enable you to capture, manage, and analyze specific data about a user. You can use them to create [filters](/docs/product-analytics/trends.md#filtering-events-based-on-properties) or [cohorts](/docs/data/cohorts.md), which can then be used in [insights](/docs/product-analytics/insights.md), [feature flags](/docs/feature-flags.md), and more.

To set a user's properties, include the `$set` or `$set_once` property when capturing any event:

### $set

JavaScript

PostHog AI

```javascript
posthog.capture('some_event', { $set: { userProperty: 'value' } })
```

### $set\_once

`$set_once` works just like `$set`, except it **only sets the property if the user doesn't already have that property set**.

JavaScript

PostHog AI

```javascript
posthog.capture('some_event', { $set_once: { userProperty: 'value' } })
```

## Super properties

Super properties are properties associated with events that are set once and then sent with every `capture` call, be it a `$screen`, an autocaptured touch, or anything else.

They are set using `posthog.register`, which takes a properties object as a parameter, and they persist across sessions.

For example:

JavaScript

PostHog AI

```javascript
posthog.register({
    'icecream pref': 'vanilla',
    team_id: 22,
})
```

The call above ensures that every event sent by the user will include `"icecream pref": "vanilla"` and `"team_id": 22`. This way, if you filtered events by property using `icecream_pref = vanilla`, it would display all events captured on that user after the `posthog.register` call, since they all include the specified Super Property.

This does **not** set the user's properties. This only sets the properties for their events. To store person properties, see the [setting person properties section](#setting-person-properties).

### Removing stored super properties

Super Properties are persisted across sessions so you have to explicitly remove them if they are no longer relevant. In order to stop sending a Super Property with events, you can use `posthog.unregister`, like so:

JavaScript

PostHog AI

```javascript
posthog.unregister('icecream pref'),
```

This will remove the super property and subsequent events will not include it.

If you are doing this as part of a user logging out you can instead simply [`posthog.reset()`](#reset-after-logout) which takes care of clearing all stored Super Properties and more.

## Opt out of data capture

You can completely opt-out users from data capture. To do this, there are two options:

1.  Opt users out by default by setting `opt_out_capturing_by_default` to `true` in your PostHog config:

JavaScript

PostHog AI

```javascript
posthog.init('<ph_project_token>', {
    opt_out_capturing_by_default: true,
});
```

2.  Opt users out on a per-person basis by calling `opt_out_capturing()`:

JavaScript

PostHog AI

```javascript
posthog.opt_out_capturing()
```

Similarly, you can opt users in:

JavaScript

PostHog AI

```javascript
posthog.opt_in_capturing()
```

To check if a user is opted out:

JavaScript

PostHog AI

```javascript
posthog.has_opted_out_capturing()
```

## Flush

You can set the number of events in the configuration that should queue before flushing. Setting this to `1` will send events immediately and will use more battery. This is set to `20` by default.

You can also configure the flush interval. By default we flush all events after `30` seconds, no matter how many events have gathered.

You can also manually flush the queue. If a flush is already in progress it returns a promise for the existing flush.

JavaScript

PostHog AI

```javascript
await posthog.flush()
```

## Reset after logout

To reset the user's ID and anonymous ID, call `reset`. Usually you would do this right after the user logs out.

JavaScript

PostHog AI

```javascript
posthog.reset()
```

## Offline behavior

The PostHog React Native SDK will continue to capture events when the device is offline. When `persistence` is set to `file` (by default), the events are stored in a queue in the device's file storage. Even when the app is closed, the events are persisted and will be flushed when the app is opened again.

-   The queue has a maximum size defined by `maxQueueSize` in the configuration.
-   When the queue is full, the oldest event is deleted first.
-   The queue is flushed only when the device is online.

## Opt in/out

By default, PostHog has tracking enabled unless it is forcefully disabled by default using the option `{ defaultOptIn: false }`.

You can give your users the option to opt in or out by calling the relevant methods. Once these have been called they are persisted and will be respected until optIn/Out is called again or the `reset` function is called.

To opt in/out of tracking, use the following calls.

JavaScript

PostHog AI

```javascript
posthog.optedOut // See if a user has opted out
posthog.optIn() // opt in
posthog.optOut() // opt out
```

If you still wish capture these events but want to create a distinction between users and team in PostHog, you should look into [Cohorts](/docs/user-guides/cohorts.md#differentiating-team-vs-users-traffic).

## Feature Flags

PostHog's [feature flags](/docs/feature-flags.md) enable you to safely deploy and roll back new features as well as target specific users and groups with them.

There are two ways to implement feature flags in React Native:

1.  Using hooks.
2.  Loading the flag directly.

### Method 1: Using hooks

#### Example 1: Boolean feature flags

React Native

PostHog AI

```jsx
import { useFeatureFlag } from 'posthog-react-native'
const MyComponent = () => {
    const booleanFlag = useFeatureFlag('key-for-your-boolean-flag')
    if (booleanFlag === undefined) {
        // the response is undefined if the flags are being loaded
        return null
    }
    // Optional use the 'useFeatureFlagWithPayload' hook for fetching the feature flag payload
    return booleanFlag ? <Text>Testing feature 😄</Text> : <Text>Not Testing feature 😢</Text>
}
```

#### Example 2: Multivariate feature flags

React Native

PostHog AI

```jsx
import { useFeatureFlag } from 'posthog-react-native'
const MyComponent = () => {
    const multiVariantFeature = useFeatureFlag('key-for-your-multivariate-flag')
    if (multiVariantFeature === undefined) {
        // the response is undefined if the flags are being loaded
        return null
    } else if (multiVariantFeature === 'variant-name') { // replace 'variant-name' with the name of your variant
      // Do something
    }
    // Optional use the 'useFeatureFlagWithPayload' hook for fetching the feature flag payload
    return <div/>
}
```

### Method 2: Loading the flag directly

React Native

PostHog AI

```jsx
// Defaults to undefined if not loaded yet or if there was a problem loading
posthog.isFeatureEnabled('key-for-your-boolean-flag')
// Defaults to undefined if not loaded yet or if there was a problem loading
posthog.getFeatureFlag('key-for-your-boolean-flag')
// Multivariant feature flags are returned as a string
posthog.getFeatureFlag('key-for-your-multivariate-flag')
// Optional fetch the payload returns 'JsonType' or undefined if not loaded yet or if there was a problem loading
posthog.getFeatureFlagPayload('key-for-your-multivariate-flag')
```

### Ensuring flags are loaded before usage

Every time a user opens the app, we send a request in the background to fetch the feature flags that apply to that user. We store those flags in the storage.

This means that for most screens, the feature flags are available immediately — **except for the first time a user visits**.

To handle this, you can use the `onFeatureFlags` callback to wait for the feature flag request to finish:

React Native

PostHog AI

```jsx
posthog.onFeatureFlags((flags) => {
  // feature flags are guaranteed to be available at this point
  if (posthog.isFeatureEnabled('flag-key')) {
    // do something
  }
})
```

### Reloading flags

PostHog loads feature flags when instantiated and refreshes whenever methods are called that affect the flag.

If want to manually trigger a refresh, you can call `reloadFeatureFlagsAsync()`:

React Native

PostHog AI

```jsx
posthog.reloadFeatureFlagsAsync().then((refreshedFlags) => console.log(refreshedFlags))
```

Or when you want to trigger the reload, but don't care about the result:

React Native

PostHog AI

```jsx
posthog.reloadFeatureFlags()
```

### Feature flag caching

The React Native SDK caches feature flag values in AsyncStorage. Cached values persist indefinitely with no TTL until updated by a successful API call. This enables offline support and reduces latency, but means **inactive users may see stale flag values** from their last session.

For example, if a user last opened your app when a flag was `false`, that value remains cached even after you roll it out to 100%. When they reopen the app, the SDK returns the cached `false` first, then fetches the fresh `true` value from the API.

To ensure fresh flag values:

React Native

PostHog AI

```jsx
// Force refresh on app start
await posthog.reloadFeatureFlagsAsync()
```

Or clear cached values for inactive users:

React Native

PostHog AI

```jsx
if (lastActiveDate < migrationDate) {
  posthog.reset() // Clears all cached data
}
```

### Request timeout

You can configure the `featureFlagsRequestTimeoutMs` parameter when initializing your PostHog client to set a flag request timeout. This helps prevent your code from being blocked in the case when PostHog's servers are too slow to respond. By default, this is set at 10 seconds.

React Native

PostHog AI

```jsx
export const posthog = new PostHog('<ph_project_token>', {
  // usually 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'
  host: 'https://us.i.posthog.com',
  featureFlagsRequestTimeoutMs: 10000 // Time in milliseconds. Default is 10000 (10 seconds).
})
```

### Error handling

When using the PostHog SDK, it's important to handle potential errors that may occur during feature flag operations. Here's an example of how to wrap PostHog SDK methods in an error handler:

React Native

PostHog AI

```jsx
function handleFeatureFlag(client, flagKey, distinctId) {
    try {
        const isEnabled = client.isFeatureEnabled(flagKey, distinctId);
        console.log(`Feature flag '${flagKey}' for user '${distinctId}' is ${isEnabled ? 'enabled' : 'disabled'}`);
        return isEnabled;
    } catch (error) {
        console.error(`Error fetching feature flag '${flagKey}': ${error.message}`);
        // Optionally, you can return a default value or throw the error
        // return false; // Default to disabled
        throw error;
    }
}
// Usage example
try {
    const flagEnabled = handleFeatureFlag(client, 'new-feature', 'user-123');
    if (flagEnabled) {
        // Implement new feature logic
    } else {
        // Implement old feature logic
    }
} catch (error) {
    // Handle the error at a higher level
    console.error('Feature flag check failed, using default behavior');
    // Implement fallback logic
}
```

### Overriding server properties

Sometimes, you might want to evaluate feature flags using properties that haven't been ingested yet, or were set incorrectly earlier. You can do so by setting properties the flag depends on with these calls:

React Native

PostHog AI

```jsx
posthog.setPersonPropertiesForFlags({'property1': 'value', property2: 'value2'})
```

Note that these are set for the entire session. Successive calls are additive: all properties you set are combined together and sent for flag evaluation.

Whenever you set these properties, we also trigger a reload of feature flags to ensure we have the latest values. You can disable this by passing in the optional parameter for reloading:

React Native

PostHog AI

```jsx
posthog.setPersonPropertiesForFlags({'property1': 'value', property2: 'value2'}, false)
```

At any point, you can reset these properties by calling `resetPersonPropertiesForFlags`:

React Native

PostHog AI

```jsx
posthog.resetPersonPropertiesForFlags()
```

The same holds for [group](/docs/product-analytics/group-analytics.md) properties:

React Native

PostHog AI

```jsx
// set properties for a group
posthog.setGroupPropertiesForFlags({'company': {'property1': 'value', property2: 'value2'}})
// reset properties for all groups:
posthog.resetGroupPropertiesForFlags()
```

> **Note:** You don't need to add the group names here, since these properties are automatically attached to the current group (set via `posthog.group()`). When you change the group, these properties are reset.

**Automatic overrides**

Whenever you call `posthog.identify` with person properties, we automatically add these properties to flag evaluation calls to help determine the correct flag values. The same is true for when you call `posthog.group()`.

**Default overridden properties**

By default, we always override some properties based on the user IP address.

The list of properties that this overrides:

1.  $geoip\_city\_name
2.  $geoip\_country\_name
3.  $geoip\_country\_code
4.  $geoip\_continent\_name
5.  $geoip\_continent\_code
6.  $geoip\_postal\_code
7.  $geoip\_time\_zone

This enables any geolocation-based flags to work without manually setting these properties.

### Bootstrapping Flags

Since there is a delay between initializing PostHog and fetching feature flags, feature flags are not always available immediately. This makes them unusable if you want to do something like redirecting a user to a different page based on a feature flag.

To have your feature flags available immediately, you can initialize PostHog with precomputed values until it has had a chance to fetch them. This is called bootstrapping. After the SDK fetches feature flags from PostHog, it will use those flag values instead of bootstrapped ones.

For details on how to implement bootstrapping, see our [bootstrapping guide](/docs/feature-flags/bootstrapping.md).

## Experiments (A/B tests)

Since [experiments](/docs/experiments/manual.md) use feature flags, the code for running an experiment is very similar to the feature flags code:

React Native

PostHog AI

```jsx
// With the useFeatureFlag hook
import { useFeatureFlag } from 'posthog-react-native'
const MyComponent = () => {
    const variant = useFeatureFlag('experiment-feature-flag-key')
    if (variant === undefined) {
        // the response is undefined if the flags are being loaded
        return null
    }
    if (variant == 'variant-name') {
        // do something
    }
}
```

It's also possible to [run experiments without using feature flags](/docs/experiments/running-experiments-without-feature-flags.md).

## Group analytics

Group analytics allows you to associate the events for that person's session with a group (e.g. teams, organizations, etc.). Read the [Group Analytics](/docs/user-guides/group-analytics.md) guide for more information.

> **Note:** This is a paid feature and is not available on the open-source or free cloud plan. Learn more on the [pricing page](/pricing.md).

-   Associate the events for this session with a group

JavaScript

PostHog AI

```javascript
posthog.group('company', 'company_id_in_your_db')
posthog.capture('upgraded_plan') // this event is associated with company ID `company_id_in_your_db`
```

-   Associate the events for this session with a group AND update the properties of that group

JavaScript

PostHog AI

```javascript
posthog.group('company', 'company_id_in_your_db', {
    name: 'Awesome Inc.',
    employees: 11,
})
```

The `name` is a special property which is used in the PostHog UI for the name of the group. If you don't specify a `name` property, the group ID will be used instead.

## Error tracking

To set up error tracking in your project, follow the [React Native installation guide](/docs/error-tracking/installation/react-native.md).

### Error boundaries

You can use the `PostHogErrorBoundary` component to capture React rendering errors thrown by components:

React Native

PostHog AI

```jsx
import { PostHogProvider, PostHogErrorBoundary } from 'posthog-react-native'
import { View, Text } from 'react-native'
const App = () => {
  return (
    <PostHogProvider apiKey="<ph_project_token>">
      <PostHogErrorBoundary
        fallback={YourFallbackComponent}
        additionalProperties={{ screen: "home" }}
      >
        <YourApp />
      </PostHogErrorBoundary>
    </PostHogProvider>
  )
}
const YourFallbackComponent = ({ error, componentStack }) => {
  return (
    <View>
      <Text>Something went wrong!</Text>
      <Text>{error instanceof Error ? error.message : String(error)}</Text>
    </View>
  )
}
```

The `fallback` prop accepts a component to render when an error occurs. The `additionalProperties` prop lets you add custom properties to the captured error event.

**Duplicate errors with console capture**

If you have both `PostHogErrorBoundary` and `console` capture enabled in your `errorTracking` config, render errors will be captured twice. This is because React logs all errors to the console by default. To avoid this, set `console: []` on `errorTracking.autocapture` (for example, `errorTracking: { autocapture: { console: [] } }`) when using `PostHogErrorBoundary`.

### Customizing exception capture with before\_send

You can use the `before_send` callback to modify, filter, or suppress exception events before they are sent to PostHog. This is useful for:

-   Adding custom properties to exceptions
-   Overriding exception fingerprints for custom grouping
-   Suppressing specific types of exceptions
-   Redacting sensitive information

React Native

PostHog AI

```jsx
const posthog = new PostHog('<ph_project_token>', {
  host: 'https://us.i.posthog.com',
  before_send: (event) => {
    if (event.event === '$exception') {
      const exceptionList = event.properties?.['$exception_list'] || []
      const exception = exceptionList.length > 0 ? exceptionList[0] : null
      if (exception) {
        // Add custom properties
        event.properties['custom_property'] = 'custom_value'
        // Override fingerprint for custom grouping
        event.properties['$exception_fingerprint'] = 'MyCustomGroup'
      }
      // Suppress specific exception types
      if (exception?.['$exception_type'] === 'IgnoredError') {
        return null // Drop the event
      }
    }
    return event
  },
})
```

You can also use `before_send` to sample or filter other event types. See the [JavaScript Web SDK documentation](/docs/libraries/js/usage.md#amending-or-sampling-events) for more examples.

## Session replay

To set up [session replay](/docs/session-replay/mobile.md) in your project, all you need to do is install the React Native SDK and the Session replay plugin, then follow the [instructions to enable Session Replay](/docs/session-replay/installation/react-native.md) for React Native.

## Surveys

To set up surveys, follow the [additional installation instructions for React Native](/docs/surveys/installation/react-native.md). Surveys launched with [popover presentation](/docs/surveys/creating-surveys.md#presentation) are automatically shown to users matching the [display conditions](/docs/surveys/creating-surveys.md#display-conditions) you set up.

> Note: URL and CSS selector targeting are not supported in React Native. Surveys that rely on these conditions will not appear.

## Debug mode

If you're not seeing the expected events being captured, the feature flags being evaluated, or the surveys being shown, you can enable debug mode to see what's happening.

You can enable debug mode by setting the `debug` option to `true` in the `PostHogProvider` options. This will enable verbose logs about the inner workings of the SDK.

React Native

PostHog AI

```jsx
<PostHogProvider
    debug={true}
    apiKey="<ph_project_token>"
    options={{
        host: "https://us.i.posthog.com",
    }}
>
```

You can also call the `debug()` method in your code.

React Native

PostHog AI

```jsx
posthog.debug()
```

## Disabling for local development

You may want to disable PostHog when working locally or in a test environment. You can do this by setting the `disable` option to `true` when initializing PostHog. Helpfully this allows you to continue using `usePostHog` and safely calling it without anything actually happening.

React Native

PostHog AI

```jsx
// App.(js|ts)
import { usePostHog, PostHogProvider } from 'posthog-react-native'
...
export function MyApp() {
    return (
        <PostHogProvider apiKey="<ph_project_token>" options={{
            // Disable PostHog in development (or whatever other logic you choose)
            disabled: __DEV__,
        }}>
            <MyComponent />
        </PostHogProvider>
    )
}
const MyComponent = () => {
    const posthog = usePostHog()
    useEffect(() => {
        // Safe to call even when disabled!
        posthog.capture("mycomponent_loaded", { foo: "bar" })
    }, [])
}
```

## Upgrading from V1, V2 to V3 or V3 to V4

V1 of this library utilised the underlying `posthog-ios` and `posthog-android` SDKs to do most of the work. Since the new version is written entirely in JS, using only Expo supported libraries, there are some changes to the way PostHog is configured as well as actually calling PostHog.

For iOS, the new React Native SDK will attempt to migrate the previously persisted data (such as `distinctId` and `anonymousId`) which should result in no unexpected changes to tracked data.

For Android, it is unfortunately not possible for persisted Android data to be loaded which means stored information such as the randomly generated `anonymousId` or the `distinctId` set by `posthog.identify` will not be present. For identified users, the simple workaround is to ensure that `identify` is called at least once when the app loads. For anonymous users there is unfortunately no straightforward workaround they will show up as new anonymous users in PostHog.

Events such as `Application Installed` and `Application Updated` that require previously persisted data were unable to be migrated, the side effect being that you may see much higher numbers for `Application Installed` events. This is due to the fact that there is no native way of detecting a real "install" and as such, we store a marker the first time the SDK loads and treat that as an install.

JSX

PostHog AI

```jsx
// DEPRECATED V1 Setup
import PostHog from 'posthog-react-native'
await PostHog.setup('<ph_project_token>', {
    // usually 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'
    host: 'https://us.i.posthog.com',
    captureApplicationLifecycleEvents: false, // Replaced by 'PostHogProvider'
    captureDeepLinks: false, // No longer supported
    recordScreenViews: false, // Replaced by 'PostHogProvider' supporting @react-navigation/native
    flushInterval: 30, // Stays the same
    flushAt: 20, // Stays the same
    android: {...}, // No longer needed
    iOS: {...}, // No longer needed
})
PostHog.capture("foo")
// V2 Setup difference
import PostHog from 'posthog-react-native'
const posthog = await Posthog.initAsync('<ph_project_token>', {
    // usually 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'
    host: 'https://us.i.posthog.com',
    // Add any other options here.
})
// Use created instance rather than the PostHog class
posthog.capture("foo")
// V3 Setup difference
import PostHog from 'posthog-react-native'
const posthog = new PostHog('<ph_project_token>', {
    // usually 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'
    host: 'https://us.i.posthog.com',
    // Add any other options here.
})
// Use created instance rather than the PostHog class
posthog.capture("foo")
// V4 Setup difference
import PostHog from 'posthog-react-native'
const posthog = new PostHog('<ph_project_token>', {
    // usually 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'
    host: 'https://us.i.posthog.com',
    captureAppLifecycleEvents: true, // instead of `captureNativeAppLifecycleEvents` or `autocapture={{ captureLifecycleEvents: true }}`,
    // captureMode: 'json', // No longer supported
    // maskPhotoLibraryImages: true, // No longer supported
})
posthog.setPersonPropertiesForFlags(...) // instead of `personProperties`
posthog.setGroupPropertiesForFlags(...) // instead of `groupProperties`
```

### Community questions

Ask a question

### Was this page useful?

HelpfulCould be better