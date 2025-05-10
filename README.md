# TeXTogether

TeXTogether is a collaborative LaTeX editor that allows multiple users to work on LaTeX documents in real-time. It features a powerful editor with syntax highlighting, real-time collaboration, integrated comments, and live PDF preview.

![TeXTogether Screenshot](/placeholder.svg?height=400&width=800)

## Features

### Real-time Collaboration

- Multiple users can edit the same document simultaneously
- See collaborators' cursors and selections in real-time
- Changes are synchronized instantly across all connected clients
- Works offline with automatic synchronization when reconnected

### Powerful LaTeX Editor

- Monaco Editor integration (the same editor used in VS Code)
- LaTeX-specific syntax highlighting
- Command autocompletion for common LaTeX commands
- Keyboard shortcuts for common actions

### Live PDF Preview

- Client-side LaTeX compilation using WebAssembly
- Instant PDF preview as you type
- Detailed error reporting for compilation issues
- Download compiled PDFs with a single click

### Document Management

- Create and manage multiple LaTeX projects
- Version history with the ability to restore previous versions
- Automatic saving to prevent data loss
- Document organization with folders and tags

### Collaboration Tools

- Integrated commenting system
- User presence indicators
- Permissions management for documents
- Share documents via link or email invitation

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Editor**: Monaco Editor
- **Real-time Collaboration**: Yjs, CRDT
- **LaTeX Compilation**: TeX Live WebAssembly (@texlive/engine)
- **Backend**: Supabase (Authentication, Database, Storage, Realtime)

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/textogether.git
   cd textogether
   ```

2. Install dependencies:

   ```bash
   npm install

   # or

   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up Supabase:

- Create a new Supabase project
- Enable authentication (email/password)
- Create the following tables:
  - `documents` (id, title, content, owner_id, created_at, updated_at)
  - `document_versions` (id, document_id, content, author_id, author_name, description, created_at)
  - `document_permissions` (id, document_id, user_id, permission_level, created_at)
  - `comments` (id, document_id, user_id, content, line_number, created_at, updated_at)
- Enable Supabase Realtime for all tables

5. Run the development server:

```bash
 npm run dev
 # or
 yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a New Document

1. Sign in to your account
2. Navigate to the dashboard
3. Click "New Project"
4. Enter a title for your document
5. Choose a template (optional)
6. Click "Create"

### Editing a Document

- Use the Monaco Editor to write your LaTeX code
- The document will automatically save as you type
- Click "Compile" to generate a PDF preview
- Use keyboard shortcuts:
- `Ctrl+S` / `Cmd+S`: Save document
- `Ctrl+B` / `Cmd+B`: Compile document
- `Ctrl+/` / `Cmd+/`: Toggle comment

### Collaborating on a Document

1. Click the "Share" button in the editor
2. Enter the email addresses of your collaborators
3. Choose permission levels (View, Comment, Edit)
4. Click "Send Invitations"

Collaborators will receive an email with a link to the document. They can then sign in (or create an account) to access the document.

### Using Comments

1. Click the comment icon in the editor toolbar
2. Select the text you want to comment on
3. Type your comment
4. Press Enter to save the comment

### Version History

1. Click the "History" tab in the editor
2. View all previous versions of the document
3. Click "Restore" to revert to a previous version

## Project Structure

```graph
textogether/
├── app/ # Next.js app directory
│ ├── dashboard/ # Dashboard pages
│ ├── editor/ # Editor pages
│ ├── login/ # Authentication pages
│ └── register/ # User registration
├── components/ # React components
│ ├── ui/ # UI components (shadcn/ui)
│ ├── latex-editor.tsx # Monaco editor component
│ ├── pdf-preview.tsx # PDF preview component
│ └── ... # Other components
├── hooks/ # Custom React hooks
│ ├── use-yjs.tsx # Yjs collaboration hook
│ └── ... # Other hooks
├── lib/ # Utility functions and libraries
│ ├── latex-compiler.ts # WebAssembly LaTeX compiler
│ ├── supabase.ts # Supabase client
│ └── ... # Other utilities
└── public/ # Static assets
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Yjs](https://yjs.dev/)
- [TeX Live WebAssembly](https://github.com/texlive/texlive-wasm)
- [Supabase](https://supabase.io/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

```
