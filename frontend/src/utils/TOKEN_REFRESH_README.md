# Token Refresh System

This document explains the automatic token refresh system implemented in the Bill-Sync application.

## Overview

The token refresh system automatically refreshes JWT access tokens before they expire, preventing authentication failures during user navigation in the SPA (Single Page Application). The system uses accurate token expiry information from the backend to calculate precise refresh timing.

## How It Works

### 1. Background Token Refresh

- **Accurate Timing**: Uses backend endpoint `/auth/token-expiry` to get precise token expiration time
- **Automatic Scheduling**: Tokens are refreshed 5 minutes before actual expiration
- **Page Visibility**: Refresh is paused when the page is not visible (user switches tabs)
- **User Activity**: Tokens are refreshed when user returns after 25+ minutes of inactivity

### 2. Reactive Token Refresh

- **401 Error Handling**: When an API call fails with 401, the system automatically attempts to refresh the token
- **Retry Mechanism**: After successful refresh, the original failed request is retried
- **Fallback**: If refresh fails, user is redirected to login

### 3. Manual Token Refresh

- **UI Component**: Users can manually refresh their session using the refresh button in the navbar
- **Hook**: Components can use `useTokenRefresh` hook for programmatic refresh

## Components

### API Utility (`utils/api.js`)

- `startBackgroundTokenRefresh()`: Starts the background refresh mechanism
- `stopBackgroundTokenRefresh()`: Stops the background refresh mechanism
- `manualTokenRefresh()`: Manually refresh the token
- `getTimeUntilExpiry()`: Gets accurate token expiry from backend
- Axios interceptors for automatic 401 handling

### Auth Context (`contexts/AuthContext.jsx`)

- Automatically starts/stops background refresh based on authentication status
- Manages token refresh lifecycle

### Token Refresh Indicator (`components/common/TokenRefreshIndicator.jsx`)

- Visual component for manual token refresh
- Shows loading state during refresh

### Hook (`hooks/useTokenRefresh.js`)

- `useTokenRefresh()`: Hook for manual token refresh in components

## Backend Endpoints

### `/auth/token-expiry` (GET)
Returns token expiry information:
```json
{
  "success": true,
  "data": {
    "expiresAt": 1640995200,
    "timeUntilExpiry": 3300,
    "expiresInMinutes": 55,
    "currentTime": 1640991900
  }
}
```

## Configuration

### Token Expiration Times

- **Access Token**: 1 hour (configurable via `ACCESS_TOKEN_EXPIRY` environment variable)
- **Refresh Token**: 30 days (configurable via `REFRESH_TOKEN_EXPIRY` environment variable)
- **Refresh Buffer**: 5 minutes before expiration

### Activity Detection

- **Inactivity Threshold**: 25 minutes
- **Activity Events**: Mouse, keyboard, scroll, touch events

## Usage

### Automatic (Default)

The system works automatically once the user is authenticated. No additional setup required.

### Manual Refresh

```jsx
import { useTokenRefresh } from "../hooks/useTokenRefresh";

const MyComponent = () => {
  const { refreshToken } = useTokenRefresh();

  const handleRefresh = async () => {
    const success = await refreshToken();
    if (success) {
      console.log("Token refreshed successfully");
    }
  };

  return <button onClick={handleRefresh}>Refresh Session</button>;
};
```

### Programmatic Control

```jsx
import {
  startBackgroundTokenRefresh,
  stopBackgroundTokenRefresh,
} from "../utils/api";

// Start background refresh
startBackgroundTokenRefresh();

// Stop background refresh
stopBackgroundTokenRefresh();
```

## User Experience

### Notifications

- **Background Refresh**: Subtle info toast when token is refreshed automatically
- **Manual Refresh**: Success toast when user manually refreshes
- **401 Error**: Loading toast during refresh, success/error toast after completion
- **Session Expired**: Error toast when refresh fails, redirect to login

### Visual Indicators

- **Refresh Button**: Available in navbar for authenticated users
- **Loading State**: Spinning icon during manual refresh
- **Disabled State**: Button disabled during refresh to prevent multiple requests

## Benefits

1. **Accurate Timing**: Uses actual token expiry from backend instead of estimates
2. **Seamless Experience**: Users don't get logged out unexpectedly
3. **Performance**: Reduces unnecessary API calls and redirects
4. **Security**: Maintains secure session management with HTTP-only cookies
5. **User Control**: Manual refresh option for edge cases
6. **Resource Efficient**: Pauses refresh when page is not visible

## Troubleshooting

### Common Issues

1. **Token not refreshing**: Check if user is authenticated and page is visible
2. **Multiple refresh attempts**: System prevents concurrent refresh attempts
3. **Activity detection not working**: Ensure user interaction events are being tracked
4. **Backend endpoint unavailable**: System falls back to default timing

### Debug Information

Check browser console for:

- Token expiry information from backend
- Token refresh scheduling logs
- Page visibility change logs
- Activity tracking logs
- Refresh success/failure logs

## Security Considerations

- Tokens are stored in HTTP-only cookies (not accessible via JavaScript)
- Token expiry information is retrieved securely from backend
- Refresh tokens are rotated on each use
- Failed refresh attempts redirect to login
- Activity detection prevents token refresh during inactivity
