
## Development

Run the dev server:

```shellscript
npm run dev
```

### Dev with auth
Create an env file `sso-middleware.env` with same content as `fint-admin-portal-sso` secret in alpha env.

How to run:

1) Start the app:
   ```bash
   npm run dev
   ```

2) Start auth proxy (Caddy + sso-middleware):
   ```bash
   docker compose up
   ```

3) Open:
   http://localhost:8000


## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY


Make sure to deploy the output of `npm run build`

-   `build/server`
-   `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
