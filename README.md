# React Native iOS App with Firebase FCM

A production-ready React Native app for iOS with Firebase Cloud Messaging (FCM) token management.

## Features

- 🔥 Firebase Cloud Messaging integration
- 📱 iOS push notifications support
- 🔐 FCM token management
- 📊 Notification history and management
- 🎯 Background and foreground message handling
- 🔄 Token refresh handling
- 🏗️ Production-ready configuration

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Add an iOS app to your project:
   - Bundle ID: `com.yourcompany.vendorapp` (or your custom bundle ID)
   - App nickname: Your app name
   - App Store ID: (optional, for production)

### 2. Download Configuration Files

#### For iOS:
1. Download `GoogleService-Info.plist` from Firebase Console
2. Replace the placeholder file at `ios/GoogleService-Info.plist`

#### For Android (if needed):
1. Download `google-services.json` from Firebase Console
2. Replace the placeholder file at `google-services.json`

### 3. Update Bundle Identifier

Update the bundle identifier in `app.json`:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.vendorapp"
    },
    "android": {
      "package": "com.yourcompany.vendorapp"
    }
  }
}
```

### 4. Configure Your Server Endpoint

Update the server endpoint in `services/FirebaseService.js`:
```javascript
const response = await fetch('https://your-api.com/api/fcm-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_AUTH_TOKEN',
  },
  body: JSON.stringify({
    token: token,
    platform: Platform.OS,
    userId: 'USER_ID',
  }),
});
```

### 5. Build for Production

#### Development Build:
```bash
npx expo run:ios
```

#### Production Build:
```bash
# Create development build
npx expo install --fix
eas build --platform ios --profile development

# Create production build
eas build --platform ios --profile production
```

### 6. Testing Push Notifications

#### Using Firebase Console:
1. Go to Firebase Console > Cloud Messaging
2. Click "Send your first message"
3. Enter notification title and text
4. Select your app
5. Send test message

#### Using FCM Token (for development):
The app displays the FCM token in development mode. You can use this token to send test notifications using tools like Postman or curl.

## Key Components

### FirebaseService
- Handles FCM token generation and management
- Sets up message handlers for different app states
- Manages token refresh and server communication

### NotificationContext
- React context for notification state management
- Provides hooks for accessing notification data
- Handles permission requests and initialization

### NotificationManager
- UI component for displaying notifications
- Shows notification history and unread count
- Handles notification interactions

## Production Considerations

### 1. Security
- Store API keys securely (use environment variables)
- Implement proper authentication for server endpoints
- Validate FCM tokens on your server

### 2. Performance
- Implement efficient notification storage
- Handle large notification lists with pagination
- Optimize background message processing

### 3. User Experience
- Request notification permissions at appropriate times
- Provide clear notification settings
- Handle notification deep linking properly

### 4. Monitoring
- Implement analytics for notification delivery
- Monitor FCM token refresh rates
- Track notification engagement metrics

## Troubleshooting

### Common Issues:

1. **FCM Token not generated**
   - Check Firebase configuration files
   - Verify bundle identifier matches Firebase project
   - Ensure proper permissions are requested

2. **Notifications not received**
   - Check device notification settings
   - Verify FCM token is sent to server
   - Test with Firebase Console first

3. **Build errors**
   - Run `npx expo install --fix`
   - Clear node_modules and reinstall
   - Check Expo SDK compatibility

### Debug Mode:
The app includes debug information in development mode:
- FCM token is displayed in notification manager
- Console logs for all notification events
- Error logging for troubleshooting

## API Integration

### Server Endpoint Example:
```javascript
// POST /api/fcm-token
{
  "token": "FCM_TOKEN_STRING",
  "platform": "ios",
  "userId": "USER_ID"
}
```

### Sending Notifications:
```javascript
// POST to FCM endpoint
{
  "to": "FCM_TOKEN",
  "notification": {
    "title": "Order Update",
    "body": "Your order has been shipped!"
  },
  "data": {
    "screen": "order_detail",
    "orderId": "12345"
  }
}
```

## License

This project is licensed under the MIT License.