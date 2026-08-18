# tex.cheminfo.org

**tex.cheminfo.org** renders LaTeX math formulas into SVG or PNG images on demand, served over a simple HTTP API. It is the self-hosted replacement for the public `tex.cheminfo.org` service (previously `cheminfo/tex-to-svg-docker`), using MathJax 3 for both server-side rendering and the React frontend for interactive authoring and sharing.

## Features

- Stateless GET API — embed rendered math anywhere with a plain `<img>` tag
- SVG and PNG output with configurable background color and PNG resolution
- React frontend with live MathJax preview, example gallery, and clipboard export
- A guided tutorial: seventeen editable steps with hoverable definitions
- Exercise series that teach the notation: reproduce a rendered formula, marked
  on what it renders to rather than on how it is written
- Shareable and embeddable: every link reproduces exactly what the author sees
- Drop-in URL compatibility with `tex.cheminfo.org/?tex=...` bookmarks and links

## Local development

```sh
npm install      # installs all workspaces (backend + frontend)
npm run dev      # backend on :10422, frontend dev server on :10423
```

The backend reads `PORT` from the environment (default `10422`); the Vite dev
server uses `PORT + 1`.

## API

OpenAPI documentation is served at [`/docs`](https://tex.cheminfo.org/docs).

### `GET /v1/?tex=<formula>`

| Parameter         | Default    | Description                     |
| ----------------- | ---------- | ------------------------------- |
| `tex`             | (required) | URL-encoded LaTeX formula       |
| `format`          | `svg`      | `svg` or `png`                  |
| `backgroundColor` | `white`    | Any CSS color string            |
| `resolution`      | `150`      | DPI, applies to PNG output only |

Returns `image/svg+xml` or `image/png`.

### `GET /v1/health`

Liveness probe, returns `{ "status": "ok" }`.

### `GET /?tex=<formula>`

Serves the React frontend with the formula preloaded. Compatible with existing
`tex.cheminfo.org/?tex=...` links; a non-browser client (an `<img>` tag) is
redirected to `/v1/` instead.

## Embed code

```html
<img src="https://tex.cheminfo.org/v1/?tex=E%3Dmc%5E2" alt="E=mc²" />
```

Replace the host with your own deployment URL as needed.

## Sharing and embedding the page

Every address the frontend understands is a link you can hand out. The **Share**
button in the header builds one for you, and offers a ready-to-paste iframe
snippet.

### Addresses

| Address           | Page                                                 |
| ----------------- | ---------------------------------------------------- |
| `/`               | The editor, optionally carrying a formula in `?tex=` |
| `/exercises`      | The exercise series, opening on the first exercise   |
| `/exercises/<id>` | One exercise — e.g. `/exercises/nernst`              |

### Parameters

| Parameter | Default | Description                                                                                                                                                                 |
| --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tex`     | (empty) | The formula the editor opens on                                                                                                                                             |
| `embed`   | off     | Drop the site header, so the page fits inside your own site. `?embed` and `?embed=1` both work                                                                              |
| `hide`    | (empty) | Comma-separated features to switch off: `examples`, `reference`, `commands`, `help`, `embedCode`, `serverRender`, `exerciseList`, `tutorialSteps`. Unknown keys are ignored |
| `zoom`    | `2`     | Preview magnification, clamped to 1–3                                                                                                                                       |

```html
<iframe
  src="https://tex.cheminfo.org/?tex=E%3Dmc%5E2&embed=1&hide=embedCode"
  width="100%"
  height="700"
  style="border: 1px solid #ddd; border-radius: 8px"
  title="tex.cheminfo.org — LaTeX to SVG"
></iframe>
```

Embedding a single exercise in a course page — `hide=exerciseList` leaves
exactly the exercise the link names:

```html
<iframe
  src="https://tex.cheminfo.org/exercises/nernst?embed=1&hide=exerciseList"
  width="100%"
  height="700"
  style="border: 1px solid #ddd; border-radius: 8px"
  title="tex.cheminfo.org — Nernst equation exercise"
></iframe>
```

## Tutorial

`/tutorial` walks the notation in seventeen steps, grouped into three
colour-coded levels. A step is not a slide: its formula is preloaded into a live
playground the student is free to take apart, and the jargon in the prose
carries hoverable definitions drawn from a glossary. The reference panel stays
beside it, and any entry clicked there is appended to the playground.

## Exercises

Six series — powers and indices, fractions and roots, Greek letters and
symbols, big operators, chemistry notation with mhchem, and environments —
hold 33 exercises. Each one renders the formula to reproduce, takes an answer
in the same editor the tool uses everywhere, and offers ordered hints and a
revealable solution.

An answer is marked on its **MathML**, not on its source: `x^{2}` and `x^2`,
`\frac12` and `\frac{1}{2}`, `\int_0^1 x^2\,dx` and `\int_{0}^{1} x^{2} dx`
are each the same answer. Progress is kept in `localStorage` and is
best-effort, so a framed page that cannot write storage still works.

## Search engines

The pages are meant to be found, so the server hands a crawler a page that is
already about the route it asked for — no script has to run first:

- **A title, a description and a canonical address per page**, written into the
  served HTML by `backend/src/utils/pageMeta.ts`. The canonical address drops
  the query string, so the formulas and share configurations the tool writes
  into the address never read as new pages.
- **A social card** — Open Graph and Twitter tags, with `public/og.png` drawn by
  this tool's own renderer.
- **`robots.txt`** allows the pages and keeps crawlers out of `/v1/` and
  `/docs`, which are endpoints rather than pages.
- **`sitemap.xml`** and the `routes.json` the server titles its pages from are
  both emitted at build time by `frontend/vite.siteFiles.ts`, out of the one
  route table in `frontend/src/state/routes.ts` — the same table the running
  app rewrites the head from — so a tutorial step or an exercise added to the
  content is listed and named without anybody remembering to.

Set `SITE_URL` in production: without it the canonical address is derived from
the request, which is only right when `TRUST_PROXY` names the proxy.

`SITE_URL` also carries a **mount path**, so the tool does not assume it owns
the root of a host. `https://example.org/tex/` makes the build write every
asset, route, canonical link, social card and sitemap entry under `/tex/`, and
the server does the same for the head it rewrites per request:

```sh
SITE_URL=https://example.org/tex/ npm run build -w frontend
docker build --build-arg SITE_URL=https://example.org/tex/ .
```

A proxy mounting the tool that way normally strips the prefix before the
request arrives, which is what the server expects. `robots.txt` is served by
the backend rather than kept in `public/`, because what it points at moves with
the mount path — and a crawler only reads it from the root of a host, so a tool
mounted under a path is covered by whatever answers that root.

## Environment

Copy `.env.example` to `.env` and adjust. Every variable is optional.

| Variable          | Default                             | Description                                                                                                                                                                                                                                                                                          |
| ----------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `COMPOSE_FILE`    | `compose.yaml`                      | Which deployment mode `docker compose` loads                                                                                                                                                                                                                                                         |
| `IMAGE_NAME`      | `ghcr.io/cheminfo/tex.cheminfo.org` | Published image name                                                                                                                                                                                                                                                                                 |
| `IMAGE_TAG`       | `latest`                            | Rewritten by the server's deploy script — do not edit by hand                                                                                                                                                                                                                                        |
| `PORT`            | `10422`                             | Port the backend listens on                                                                                                                                                                                                                                                                          |
| `SITE_URL`        | (unset)                             | Where the site is served, origin and mount path together, e.g. `https://tex.cheminfo.org/` or `https://example.org/tex/`, written into every canonical and social address. Unset derives the origin from the request, which is only right when `TRUST_PROXY` names the proxy, and mounts at the root |
| `TRUST_PROXY`     | `false`                             | The reverse proxies whose `X-Forwarded-For` is believed: an address, a CIDR range, a list, or a hop count                                                                                                                                                                                            |
| `TRACKING_SCRIPT` | (unset)                             | Audience-measurement snippet, injected verbatim at the end of the served page's `<head>`. Unset means nothing is loaded, so a dev run tracks nothing                                                                                                                                                 |
| `TUNNEL_TOKEN`    | (unset)                             | Cloudflare Tunnel token, for the cloudflared mode only                                                                                                                                                                                                                                               |

## Deployment

```sh
cp .env.example .env
# uncomment exactly one COMPOSE_FILE line in .env, then:
docker compose up -d
```

With no `COMPOSE_FILE` set, `docker compose` uses `compose.yaml`. Use
`docker compose pull && docker compose up -d` to run the published image, or
`docker compose up -d --build` to build from the current checkout.

| `COMPOSE_FILE`             | Mode                                                                  |
| -------------------------- | --------------------------------------------------------------------- |
| `compose.yaml`             | Port-published: the container listens on `${PORT:-10422}` on the host |
| `compose.traefik.yaml`     | Behind a Traefik reverse proxy, no published port                     |
| `compose.cloudflared.yaml` | Behind a Cloudflare Tunnel, no published port                         |

**Traefik** requires the host to already run Traefik on an external Docker
network named `traefik`, with a `websecure` entrypoint and a `letsencrypt` cert
resolver. Adjust the `Host(...)` label to your hostname (default
`tex.cheminfo.org`).

**Cloudflare Tunnel**: in the Cloudflare dashboard, Networking → Tunnels →
Create a tunnel → Cloudflared connector, copy the token into `.env` as
`TUNNEL_TOKEN`, then open the tunnel's _Published applications_ tab and add an
application with Service `HTTP`, URL `tex:10422`, hostname `tex.lactame.com`.

## Deploy and rollback

Deployment is handled by the global deploy script installed on the server, never
by `git pull && docker compose up -d --build` — that overwrites the running tag
in place and moves the source underneath it, leaving nothing to roll back to.

This repository only provides what that script consumes: every compose file
resolves `${IMAGE_NAME:-…}:${IMAGE_TAG:-latest}`, `.env` carries both variables,
and the backend exposes `/v1/health`. The script writes an immutable `IMAGE_TAG`
into `.env` and keeps its per-host state in `.deploy`, which is never committed.

---

Both server-side rendering and browser preview are powered by [MathJax 3](https://www.mathjax.org/).
