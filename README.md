# PDF Highlight Viewer

A Next.js application for viewing PDFs and creating, managing, and saving highlights.

## Features

- PDF file upload and viewing
- Text highlighting with custom positions
- Save highlights with the "Save Highlights" button
- View and manage saved highlights
- Highlights are saved to localStorage

## Prerequisites

- Node.js 18.x or later
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/PrinceVirmani/pdfhighlight.git
cd pdfhighlight
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

```bash
npm run build
# or
yarn build
```

## Deployment

### Deploying to Vercel

1. Make sure all dependencies are correctly listed in package.json
2. Push your code to GitHub
3. Connect your GitHub repository to Vercel
4. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## Project Structure

- `src/Components/`: React components
  - `LeftSide.tsx`: Handles PDF file uploads
  - `MidSection.tsx`: Displays the PDF and integrates highlighting functionality
  - `RightSide.tsx`: Manages and displays highlights
- `src/context/`: Application state management
  - `AppContext.tsx`: Manages application state using React Context
- `src/plugins/`: Custom plugins
  - `highlightPlugin.tsx`: Custom plugin for PDF highlighting functionality
- `src/app/`: Next.js app router files

## Dependencies

- Next.js: React framework
- React: UI library
- @react-pdf-viewer/core: Core PDF viewer functionality
- @react-pdf-viewer/highlight: PDF highlighting functionality
- pdfjs-dist: PDF.js library for rendering PDFs

## Troubleshooting

### Build Errors

If you encounter build errors related to missing dependencies:

1. Ensure all required dependencies are installed:

```bash
npm install @react-pdf-viewer/core @react-pdf-viewer/highlight pdfjs-dist
```

2. Check import paths in your components:

```typescript
// Correct import paths use the @/ prefix
import { useAppContext } from "@/context/AppContext";
import { highlightPlugin, Trigger } from "@/plugins/highlightPlugin";
```

3. Verify that your tsconfig.json has the correct path aliases:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

## Future Improvements

See the [PDF_Viewer_Improvement_Plan.md](./PDF_Viewer_Improvement_Plan.md) file for a comprehensive plan of future enhancements.

## License

MIT
