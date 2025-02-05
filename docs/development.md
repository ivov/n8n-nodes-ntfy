## Development

1. Clone this repo and link this package globally:

```sh
git clone https://github.com/ivov/n8n-nodes-ntfy.git
cd n8n-nodes-ntfy
npm link
pnpm install
pnpm run build
```

2. Link this package to n8n's custom nodes directory:

```sh
cd ~/.n8n/custom
npm link n8n-nodes-ntfy
```

3. Start n8n:

```sh
git clone https://github.com/n8n-io/n8n.git
cd n8n
pnpm install
pnpm build
pnpm start
```