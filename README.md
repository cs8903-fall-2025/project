# CS8903 ODC Project

## Getting Started

Before digging into development, you'll need to set things up.

### DevContainer

The easiest way to get started is to use the included DevContainer configuration.

1. Download and install [OrbStack](https://orbstack.dev) or [Docker](https://www.docker.com)
2. Launch OrbStack or Docker
3. Open this project in VS Code and click "Re-open in container" when prompted or enter `cmd + shift + p` and type `Dev Containers: Reopen in Container`

This will re-open the project in vs code with a remote connection to a docker container with everything you need for development set-up.

### Local Development

You can also develop on your own computer. Just install `node@22.19.0`. After installing Node, upgrade npm by running `npm install -g npm@11.6.0`.

For local development it is recommended to use a version manager. This project is already configured with a `tool-versions` file compatible with [ASDF](https://asdf-vm.com) and [Mise](https://mise.jdx.dev). (ASDF is used in the DevContainer).

## Directory Structure

This project is setup as a monorepo. The `apps` directory contains the executables: website and web app. The `packages` contains shared code. Apps and packages can import from packages. Apps should never import from other apps.

## Tooling

This project is setup with linting and formating.

- Check for errors with `npm run lint`
- Check and automatically fix errors with `npm run lint:fix`
- Format source code with `npm run format`

If you're using VS Code, this project comes with recommended plugins and configuration. Install the plugins and the configuration will be automatically applied. You will get automatic linting in the editor and format on save, following the rules defined in this project.

## Key Technologies

The website is built with [Astro](https://astro.build), which is a framework designed specifically for content-driven websites. It can use any combination of static (file-based) or dynamic (i.e. database) content.

The app is built with [Hono](https://hono.dev), which is a framework like ExpressJS but that can be hosted on the Edge.

Both the website and app will be hosted on [Cloudflare Pages](https://pages.cloudflare.com) which is a feature-rich edge computing platform with a generous free tier.

## Development

You can run in development mode with the following commands:

```bash
npm run dev
npm run dev -w=apps/app     # runs app only
npm run dev -w=apps/website # runs website only
```

In development mode you will have unoptimized development builds and any changes you make on the file system will trigger live reload.

The apps will be running at:

- App on [http://localhost:5173](http://locahost:5173)
- Website on [http://locahost:4321](http://localhost:4321)

## Build for Production

You can create production builds with the following command:

```bash
npm run build
npm run build -w=apps/app     # builds app only
npm run build -w=apps/website # builds website only
```

## Preview for Production

You can create and preview production builds with the following command:

```bash
npm run preview
npm run preview -w=apps/app     # previews app only
npm run preview -w=apps/website # previews website only
```

This will build `apps/app` and `apps/website` for production and run them locally:

- App preview on [http://localhost:8788](http://locahost:8788)
- Website preview on [http://locahost:4321](http://localhost:4321)

## Deployment

Details coming soon

- Cloudflare Pages should be super flexible for hosting both the app and the website
- Cloudflare Pages [supports monorepos](https://developers.cloudflare.com/pages/configuration/monorepos/) like this one

## Troubleshooting

### Nothing is running on the documented port

If you expect to see the app or website running on a certain port but it's not, that might be because the port was already in use so another port was assigned. Fortunately, when the servers start up they output the port they are running on. You can find this in the application logs output to standard out in your terminal.
