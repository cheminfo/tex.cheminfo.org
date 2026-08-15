# tex.cheminfo.org

**tex.cheminfo.org** renders LaTeX math formulas into SVG or PNG images on demand, served over a simple HTTP API. It is the self-hosted replacement for the public `tex.cheminfo.org` service (previously `cheminfo/tex-to-svg-docker`), using MathJax 3 for both server-side rendering and the React frontend for interactive authoring and sharing.

## Features

- Stateless GET API — embed rendered math anywhere with a plain `<img>` tag
- SVG and PNG output with configurable background color and PNG resolution
- React frontend with live MathJax preview, example gallery, and clipboard export
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

| Parameter | Default | Description                                                                                                                                |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `tex`     | (empty) | The formula the page opens on                                                                                                              |
| `embed`   | off     | Drop the site header, so the page fits inside your own site. `?embed` and `?embed=1` both work                                             |
| `hide`    | (empty) | Comma-separated features to switch off: `examples`, `reference`, `commands`, `help`, `embedCode`, `serverRender`. Unknown keys are ignored |
| `zoom`    | `2`     | Preview magnification, clamped to 1–3                                                                                                      |

```html
<iframe
  src="https://tex.cheminfo.org/?tex=E%3Dmc%5E2&embed=1&hide=embedCode"
  width="100%"
  height="700"
  style="border: 1px solid #ddd; border-radius: 8px"
  title="tex.cheminfo.org — LaTeX to SVG"
></iframe>
```

## Environment

Copy `.env.example` to `.env` and adjust. Every variable is optional.

| Variable          | Default                             | Description                                                                                                                                          |
| ----------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `COMPOSE_FILE`    | `compose.yaml`                      | Which deployment mode `docker compose` loads                                                                                                         |
| `IMAGE_NAME`      | `ghcr.io/cheminfo/tex.cheminfo.org` | Published image name                                                                                                                                 |
| `IMAGE_TAG`       | `latest`                            | Rewritten by `./deploy.sh` — do not edit by hand                                                                                                     |
| `PORT`            | `10422`                             | Port the backend listens on                                                                                                                          |
| `TRUST_PROXY`     | `false`                             | The reverse proxies whose `X-Forwarded-For` is believed: an address, a CIDR range, a list, or a hop count                                            |
| `TRACKING_SCRIPT` | (unset)                             | Audience-measurement snippet, injected verbatim at the end of the served page's `<head>`. Unset means nothing is loaded, so a dev run tracks nothing |
| `TUNNEL_TOKEN`    | (unset)                             | Cloudflare Tunnel token, for the cloudflared mode only                                                                                               |

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

Deploy with `./deploy.sh`, never with `git pull && docker compose up -d --build`
— that overwrites the running tag in place and moves the source underneath it,
leaving nothing to roll back to.

```sh
./deploy.sh              # build, tag immutably, start, health-probe, auto-revert on failure
./deploy.sh rollback     # back to the previous deployment (image + source commit)
./deploy.sh rollback TAG # back to a specific recorded deployment
./deploy.sh list         # the active tag and the deployment history
./deploy.sh prune        # drop images older than the last 10 deployments
```

Each deploy writes an immutable `IMAGE_TAG` into `.env` and records it in
`.deploy/history` with its commit. A rollback leaves a detached HEAD on purpose;
run `git checkout main` once the fix is pushed.

---

Both server-side rendering and browser preview are powered by [MathJax 3](https://www.mathjax.org/).
