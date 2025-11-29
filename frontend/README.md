# AI Symptom Checker Frontend

This is the React TypeScript frontend for the AI Symptom Checker application.

## Features

- **Modern UI**: Beautiful glassmorphism design with gradient backgrounds
- **Responsive**: Works on desktop and mobile devices
- **Real-time Status**: Shows API connection status
- **Interactive Form**: Easy symptom selection with checkboxes
- **Smart Validation**: Form validation and error handling
- **Detailed Results**: Comprehensive prediction display with confidence scores
- **Safety Warnings**: Emergency alerts for serious conditions
- **Professional UX**: Smooth animations and loading states

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Open http://localhost:3000 in your browser

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Components

- `SymptomChecker` - Main container component
- `SymptomForm` - Symptom input form
- `PredictionResult` - Results display component

## API Integration

The frontend communicates with the Flask backend running on http://localhost:5000

### Endpoints Used:
- `GET /api/health` - Check backend status
- `GET /api/symptoms` - Get available symptoms
- `POST /api/predict` - Submit prediction request

## Styling

- Modern CSS3 with gradients and glassmorphism effects
- Responsive grid layouts
- Smooth animations and transitions
- Professional color scheme

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **CSS3** - Styling with modern effects
- **Create React App** - Build tooling

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

To customize the UI or add new features:

1. Components are in `src/components/`
2. Types are defined in `src/types/`
3. API service is in `src/services/`
4. Styles are component-specific CSS files

## Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.