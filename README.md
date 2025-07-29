# OW2 Icon & Gradient Generator

A web application for generating gradient text and adding icon codes for Overwatch 2 chat.

## Features

- Real-time preview of gradient text
- Custom color picker with hex input support
- Preset gradient combinations
- Overwatch 2 icon codes with search functionality
- Message splitting for 200-character limit

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
4. Add Overwatch 2 icons using the search feature
5. Copy the generated color codes
6. Paste directly into Overwatch 2 chat

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - Code linting
- `npm run format` - Code formatting

## Project Structure

```
src/
├── components/          # UI components (text input, color picker, icon selector)
├── hooks/              # Custom React hooks
├── utils/              # Utility functions (color utils, gradient generation)
├── types/              # TypeScript definitions
├── constants/          # App constants (gradients, icon codes)
└── App.tsx             # Main component
```

## Tech Stack

- React 18 with TypeScript
- Vite
- Tailwind CSS
