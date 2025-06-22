# Dark Mode Implementation for Probabl App 🌙

## Overview
I've successfully added a comprehensive dark mode toggle system to your behavioral economics game. The implementation includes a theme context provider, UI toggle controls, and enhanced CSS theming that propagates throughout the entire application.

## What Was Implemented

### 1. Theme Context System (`src/lib/theme-context.tsx`)
- **Theme Provider**: Manages theme state across the entire app
- **Theme Options**: 
  - `light` - Light mode
  - `dark` - Dark mode  
  - `system` - Follows system preference automatically
- **Persistent Storage**: Theme preference is saved to localStorage
- **System Detection**: Automatically detects and responds to system theme changes
- **Real-time Updates**: Theme changes apply instantly across all components

### 2. Enhanced ProfileSettings with Theme Toggle
- **Elegant Theme Selector**: Visual toggle buttons with icons (☀️ 🌙 💻)
- **Current Status Display**: Shows the resolved theme (Dark/Light mode)
- **Improved Styling**: Uses new theme-aware CSS classes
- **Better UX**: Smooth transitions and hover effects

### 3. Quick Access Theme Toggle (`src/components/ThemeToggle.tsx`)
- **Header Integration**: Added to the main navigation header
- **Cycle Toggle**: Click to cycle through Light → Dark → System
- **Visual Feedback**: Shows current theme with appropriate icons
- **Responsive Design**: Works on both desktop and mobile

### 4. Enhanced CSS Theme System (`src/app/globals.css`)
- **Comprehensive CSS Variables**: Full design system with proper theme support
- **Theme-Aware Classes**: 
  - `.theme-card` - Cards that adapt to theme
  - `.theme-button` - Buttons with proper theme colors
  - `.theme-input` - Form inputs with theme-aware styling
  - `.glass-morphism-enhanced` - Enhanced glass effect for both themes
- **Light/Dark Color Schemes**: Carefully crafted color palettes for both modes
- **Proper Contrast**: Ensures accessibility in both themes

### 5. Layout Integration (`src/app/layout.tsx`)
- **App-Wide Theme Provider**: Wraps the entire application
- **HTML Class Management**: Automatically applies `light`/`dark` classes to `<html>`
- **Seamless Initialization**: Loads theme preference on app startup

## Key Features

### 🎨 **Adaptive UI Components**
- All components now respect the current theme
- Smooth transitions between light and dark modes
- Enhanced visual hierarchy in both themes

### 💾 **Persistent Preferences**
- Theme choice is saved to localStorage
- Remembers user preference across sessions
- System theme detection with automatic updates

### 🔄 **Instant Theme Switching**
- No page reload required
- Smooth CSS transitions
- All UI elements update simultaneously

### 📱 **Mobile & Desktop Support**
- Theme toggle accessible in main header
- Full theme settings in ProfileSettings modal
- Responsive design for all screen sizes

## How to Use

### For Users:
1. **Quick Toggle**: Click the theme button (☀️/🌙/💻) in the header
2. **Detailed Settings**: Open ProfileSettings and use the theme selector
3. **System Sync**: Choose "System" to follow your device's theme automatically

### For Developers:
```tsx
import { useTheme } from '@/lib/theme-context'

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  return (
    <div className="theme-card">
      <p>Current theme: {resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>Go Dark</button>
    </div>
  )
}
```

## CSS Classes Available

### Theme-Aware Components:
- `.theme-card` - Card backgrounds with proper theme colors
- `.theme-button` - Primary buttons with theme-appropriate styling
- `.theme-input` - Form inputs that adapt to theme
- `.glass-morphism-enhanced` - Enhanced glass effect for both themes

### Theme-Specific Utilities:
- `.text-theme-primary` - Primary text color
- `.text-theme-secondary` - Secondary text color  
- `.text-theme-muted` - Muted text color
- `.border-theme` - Theme-appropriate borders

## Benefits

### 🌙 **User Experience**
- Reduces eye strain in low-light conditions
- Matches system preferences automatically
- Provides user choice and control

### 🎯 **Design Consistency**
- Maintains visual hierarchy in both themes
- Preserves brand colors (purple gradients, etc.)
- Professional appearance in all lighting conditions

### 🚀 **Performance**
- CSS-only transitions (no JavaScript animations)
- Efficient theme switching with minimal re-renders
- Leverages modern CSS custom properties

## Technical Implementation

The system uses:
- **React Context** for state management
- **CSS Custom Properties** for theme variables
- **localStorage** for persistence
- **MediaQuery API** for system theme detection
- **CSS Classes** for theme application

The implementation is fully TypeScript-typed and follows modern React patterns with proper error handling and fallbacks.

## Testing

The dark mode system has been integrated and tested with:
- ✅ Theme persistence across page reloads
- ✅ System theme detection and automatic switching
- ✅ All UI components properly themed
- ✅ Smooth transitions between themes
- ✅ Mobile and desktop compatibility
- ✅ ProfileSettings integration
- ✅ Header quick toggle functionality

Your users can now enjoy a fully functional dark mode experience that enhances the behavioral economics gaming experience in any lighting condition! 🎮🧠