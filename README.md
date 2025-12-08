# CS8903 ODC Project

## Getting Started

Before digging into development, you'll need to set things up.

### DevContainer

Requirements: Containerization (i.e. Docker, OrbStack)

The easiest way to get started is to use the included DevContainer configuration.

1. Download and install [OrbStack](https://orbstack.dev) or [Docker](https://www.docker.com)
2. Launch OrbStack or Docker
3. Open this project in VS Code and click "Re-open in container" when prompted or enter `cmd + shift + p` and type `Dev Containers: Reopen in Container`

This will re-open the project in vs code with a remote connection to a docker container with everything you need for development set-up.

### Local Development

Requirements: NodeJS

You can also develop on your own computer. Just install `node@24.11.1`. After installing Node, install pnpm with `npm install -g pnpm@latest-10`.

For local development it is recommended to use a version manager. This project is already configured with a `tool-versions` file compatible with [ASDF](https://asdf-vm.com) and [Mise](https://mise.jdx.dev). (ASDF is used in the DevContainer).

## Directory Structure

This project is setup as a monorepo. The `apps` directory contains the executables: website and web app. The `packages` directory contains shared code. Apps and packages can import from packages. Apps should never import from other apps.

## Tooling

This project is setup with linting and formating.

- Check for errors with `pnpm lint`
- Check and automatically fix errors with `pnpm lint:fix`
- Format source code with `pnpm format`

If you're using VS Code, this project comes with recommended plugins and configuration. Install the plugins and the configuration will be automatically applied. You will get automatic linting in the editor and format on save, following the rules defined in this project.

## Key Technologies

The website is built with [Astro](https://astro.build), which is a framework designed specifically for content-driven websites. It can use any combination of static (file-based) or dynamic (i.e. database) content.

The app is built with [Vite](https://vite.dev/), which is a JavaScript build tool.

Both the website and app are hosted on [Cloudflare Workers](https://workers.cloudflare.com) which is a feature-rich edge computing platform with a generous free tier.

Other key pieces of technology used in this project:

- [TypeScript](https://www.typescriptlang.org) for type-safe JavaScript development
- [TailwindCSS](https://tailwindcss.com) for utility-first CSS styling
- [pnpm](https://pnpm.io) for fast, disk space efficient package management
- [Turborepo](https://turborepo.org) for monorepo management
- [ESLint](https://eslint.org) for linting
- [Prettier](https://prettier.io) for code formatting
- [Vite PWA](https://vite-pwa-org.netlify.app/) for progressive web app support in the app
- [RxDB](https://rxdb.info) for client-side database in the app
- [Gemini Nano](https://developer.chrome.com/docs/ai) for client-side AI processing in the app
- [OCRS](https://github.com/robertknight/ocrs) for client-side OCR in the app
- [shadcn/ui](https://ui.shadcn.com) for component library in the app
- [RadixUI](https://www.radix-ui.com) for accessible UI primitives in the app
- [React](https://react.dev) for building user interfaces in the app
- And more...

## Development

You can run in development mode with the following commands:

```bash
pnpm dev         # runs app and website
pnpm dev:app     # runs app only
pnpm dev:website # runs website only
```

In development mode you will have unoptimized development builds and any changes you make on the file system will trigger live reload.

The apps will be running at:

- App on [http://localhost:5173](http://locahost:5173)
- Website on [http://locahost:4321](http://localhost:4321)

## Build for Production

You can create production builds with the following command:

```bash
pnpm build
pnpm build --filter=pwa       # builds app only
pnpm build --filter=website   # builds website only
```

## Preview for Production

You can create and preview production builds with the following command:

```bash
pnpm preview
pnpm preview --filter=pwa       # previews app only
pnpm preview --filter=website   # previews website only
```

This will build `apps/app` and `apps/website` for production and run them locally:

- App preview on [http://localhost:4173](http://locahost:4173)
- Website preview on [http://locahost:4321](http://localhost:4321)

## Deployment

- If changes to the packages or the app are merged into the main branch, the application is automatically deployed to the Cloudflare workers platform.
- If changes to the packages or the website are merged into the main branch, the website is automatically deployed to the Cloudflare workers platform.
- Pull requests that have changes to the packages or app will automatically deploy staging environments and include a link to the staging url in the comments on the pull request.
- Pull requests that have changes to the packages or website will automatically deploy staging environments and include a link to the staging url in the comments on the pull request.

## Live in Production

- [website](https://cs8903-odc-website.nkenyeres3.workers.dev)
- [app](https://cs8903-odc-app.nkenyeres3.workers.dev)

## Troubleshooting

### Nothing is running on the documented port

If you expect to see the app or website running on a certain port but it's not, that might be because the port was already in use so another port was assigned. Fortunately, when the servers start up they output the port they are running on. You can find this in the application logs output to standard out in your terminal.
