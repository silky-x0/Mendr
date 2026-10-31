import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

const favicon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' rx='4' fill='%23F7F4EE'/%3E%3Cpath d='M1 8H4L5.5 3L8.5 13L10 8H15' fill='none' stroke='%231F1B16' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"

const fonts =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Serif:wght@500&display=swap'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Mendr — self-maintaining APIs' },
      {
        name: 'description',
        content:
          'Mendr watches the HTTP calls your service makes and serves, catches API contract drift, and shows what changed and which lines of your code depend on it.',
      },
      { property: 'og:title', content: 'Mendr — self-maintaining APIs' },
      {
        property: 'og:description',
        content:
          'Catch API contract drift: what changed upstream, where your code depends on it, and how to fix it.',
      },
      { property: 'og:type', content: 'website' },
    ],
    links: [
      { rel: 'icon', href: favicon },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      { rel: 'stylesheet', href: fonts },
      { rel: 'stylesheet', href: appCss },
    ],
    scripts: [{ children: "document.documentElement.classList.add('js')" }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
