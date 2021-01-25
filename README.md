# Well Check [Mobile App]

This README describes the steps needed to run the **WellCheck** mobile app

## Pre-requisites

### 1. System requirements

- Node.js
- NPM
- [watchman](https://facebook.github.io/watchman/docs/install.html)
- Java JRE and JDK
- react-native-cli
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger/releases)
- [Android Studio](https://developer.android.com/studio/install)

### 2. Cloning

The standard way to install this project is to [clone the repository](https://github.com/digitalequation/well-check-mobile) and setup the environment

- [MacOS environment](https://medium.com/@pabasarajayawardhana/react-native-environment-set-up-on-mac-os-with-xcode-and-android-studio-324e64c8552e)
- [Linux environment](https://dev.to/prakhil_tp/react-native-cli-and-android-studio-setting-up-the-development-environment-on-linux-4jp6)
- [Windows environment](https://medium.com/@leonardobrunolima/react-native-tips-setting-up-your-development-environment-for-windows-d326635604ea)

### 3. Setup

**1**. Run the following commands in terminal:

```
cd well-check-mobile

# 1. Install NPM dependencies
$ npm install

# 2. Link react-native dependencies
$ react-native link
$ react-native link react-native-vector-icons
$ react-native link react-native-fs

# 3. Start Android Studio emulator (https://github.com/digitalequation/well-check-mobile)
example: $ /Users/janedoe/Library/Android/sdk/emulator/emulator -avd Nexus_5X_API_23

# 4. Start react native Metro server
$ react-native start --reset-cache

# 5. Compile the assets and install the app on the emulator
### Open another terminal tab and run:
$ react-native run-android
or
$ react-native run-ios
```

**2**. Start React Native Debugger

**3**. Access the 'Metro' server terminal tab and press: 'd'. A dialog will open in the emulator and select 'Debug'.
       This will connect the app to the React Native Debbuger

## Quick references

### Paths

- **Compiled code** - `android` and `ios`
- **Javascript** - `src`
    - Add new **React Native Screens/ Pages** in `src/screens`
    - Add new **React Native Common Components** in `components/common`
    - Add new **API endpoints** in `src/services`
    - Modify **axios interceptors** in `src/Http.js`
    - Add new **Utils/ reusable common functions** in `src/Utils.js`
    - Add new **navigation route** in `src/navigation` using [react-navigation](https://reactnavigation.org/docs/getting-started)
    - Modify **react redux** in `src/redux-store`

- **Scaled Sheet Styles** - `src/assets/styles/`
- **Fonts** - `src/assets/fonts/`
- **Images** - `src/assets/images/`
- **Theme** - `native-base-theme`

### Main libraries

##### Utilities

- __[react-navigation](https://reactnavigation.org/docs/getting-started)__ - react native screens navigation
- __[ree-validate](https://github.com/moeen-basra/ree-validate)__ - input validation library
- __[react-redux](https://github.com/reduxjs/react-redux)__ - react redux for cross-component/ global communication
- __[react-native-secure-storage](https://github.com/oyyq99999/react-native-secure-storage)__ - for storing and encrypting sensitive info
- __[react-native-voice](https://github.com/jamsch/react-native-voice)__ - voice dictation (to be replaced with @react-native-community/voice)
- __[react-native-render-html](https://github.com/archriss/react-native-render-html)__ - HTML rendering
- __[react-native-photo-upload](https://github.com/malsapp/react-native-photo-upload)__ - photo upload (from phone or taking picture);
requires manual permissions request in 'android/app/gradle' and in 'ios'
- __[react-native-image-resizer](https://github.com/bamlab/react-native-image-resizer)__ - image resizing
- __[react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)__ - gesture listener
- __[react-native-device-info](https://github.com/react-native-community/react-native-device-info)__
- __[react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)__ - safe area view for IOS (to handle notches)
- __[react-native-webview](https://github.com/react-native-webview/react-native-webview)__ - web page rendering
- __[react-native-netinfo](https://github.com/react-native-community/react-native-netinfo)__ - internet connection listener
- __[react-native-qrcode-scanner](https://github.com/moaazsidat/react-native-qrcode-scanner)__ - camera app for QR code scanning
    - __[react-native-permissions](https://github.com/zoontek/react-native-permissions)__ - dependency of QR code scanning library
    - __[react-native-camera](https://github.com/react-native-community/react-native-camera)__ - dependency of QR code scanning library

##### UI

- __[NativeBase](https://docs.nativebase.io/)__ - main UI library
- __[react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)__ - Library for icons (we use Ionicons)
- __[react-native-material-textfield](https://github.com/n4kz/react-native-material-textfield)__ - TextField library
- __[react-native-size-matters](https://github.com/nirsky/react-native-size-matters)__ - styles with scaling
- __[react-native-step-indicator](https://github.com/24ark/react-native-step-indicator)__ - for survey page
- __[react-native-chart-kit](https://www.npmjs.com/package/react-native-chart-kit)__
- __[react-native-chip-view](https://github.com/prscX/react-native-chip-view)__ - chip components
- __[react-native-collapsible-header-views](https://github.com/iyegoroff/react-native-collapsible-header-views)__) - for on-scroll collapsing headers
- __[react-native-search-header](https://github.com/tuantle/react-native-search-header)__ - search input inside header
- __[react-native-snackbar](https://github.com/cooperka/react-native-snackbar)__ - snackbar component
- __[react-native-snap-carousel](https://github.com/archriss/react-native-snap-carousel)__ - photo gallery
- __[react-native-star-rating](https://github.com/djchie/react-native-star-rating)__ - star rating (up to 5 stars)
- __[react-native-off-canvas-menu](https://github.com/proshoumma/react-native-off-canvas-menu)__ - menu drawer with animation
- __[react-native-floating-action](https://github.com/santomegonzalo/react-native-floating-action)__ - floating action button and floating action menu
- __[react-native-indicators](https://github.com/n4kz/react-native-indicators)__ - for loading bars
- __[react-native-modals](https://github.com/jacklam718/react-native-modals)__ - modals/ dialogs for mobile


### FAQs

- Q: **Icons not rendering properly**
- A: Run: `react-native link react-native-vector-icons` and restart the environment and the emulator

- Q: **Fonts error on ios**
- A: Open XCode and access: `Build Phases/Copy Bundle Resources` and remove all font (tff) files

- Q: **App not running**
- A: Run:
    ```
    watchman watch-del-all && rm -rf node_modules/ && npm cache verify && npm install
    react-native link
    react-native link react-native-vector-icons
    react-native link react-native-fs
    react-native start --reset-cache
    react-native run-android / react-native run-ios
    sudo pkill -9 node (when xcode build is stuck)
    ```

- Q: **Multi Dex error on Android**
- A: Add to `android/app/build.gradle` in the `defaultConfig` object: `multiDexEnabled true`

- Q: **Cannot choose between the following variants of project :react-native-camera:**
- A: Add to `android/app/build.gradle` in the `defaultConfig` object: `missingDimensionStrategy 'react-native-camera', 'general'`
