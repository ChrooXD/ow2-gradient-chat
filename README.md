# OW2 Chat Gradient Text Generator

A web application for generating gradient text for Overwatch 2 chat using color codes.

## Features

- Real-time preview of gradient text
- Custom color picker with hex input support
- Preset gradient combinations
- Copy to clipboard or download as file
- Responsive design with keyboard shortcuts
- Input validation and error handling

## Quick Start

```bash
git clone <repository-url>
cd ow2-gradient-text-generator
npm install
npm run dev
```

## Usage

1. Enter your text in the input field
2. Select start and end colors using the color pickers
3. Choose from preset gradients or create custom combinations
4. Copy the generated OW2 color codes
5. Paste directly into Overwatch 2 chat

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - Code linting
- `npm run format` - Code formatting

## Project Structure

```
src/
├── components/          # UI components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript definitions
├── constants/          # App constants
└── App.tsx             # Main component
```

## Tech Stack

- React 18 with TypeScript
- Vite
- Tailwind CSS