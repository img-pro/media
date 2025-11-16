# Img.pro Media Gallery

Minimalist media management interface for the Img.pro image hosting service.

## Features

- View all uploaded images
- List view optimized for performance
- Size variant management
- Quick actions (copy URL, delete)
- Infinite scroll pagination
- No backend required - runs entirely in the browser

## Development

```bash
# Install dependencies
npm install

# Start development server (localhost:3001)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Deploy to Cloudflare Pages:

```bash
# Deploy to production
npm run deploy

# Deploy preview branch
npm run deploy:preview
```

Or connect to GitHub for automatic deployments.

## Configuration

The app automatically uses different API endpoints based on environment:
- Development: `https://test.api.img.pro`
- Production: `https://api.img.pro`

## Authentication

Uses token-based authentication with SSO flow:
1. User clicks login
2. Redirects to `app.img.pro` for authentication
3. Returns with token
4. Token stored in localStorage

## Tech Stack

- [Alpine.js](https://alpinejs.dev/) - Reactive UI
- [Vite](https://vitejs.dev/) - Build tool
- [Cloudflare Pages](https://pages.cloudflare.com/) - Hosting

## License

MIT - See [LICENSE](./LICENSE) file

## Trademark

"Img.pro" and associated branding are trademarks. While the code is MIT licensed, the brand name and logo cannot be used without permission.