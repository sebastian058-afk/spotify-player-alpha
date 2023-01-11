# Next.js + Tailwind CSS Example

This example shows how to use [Tailwind CSS](https://tailwindcss.com/) [(v3.2)](https://tailwindcss.com/blog/tailwindcss-v3-2) with Next.js. It follows the steps outlined in the official [Tailwind docs](https://tailwindcss.com/docs/guides/nextjs).

## How to use

Create or use an existing Spotify Account via www.spotify.com.

Navigate to https://developer.spotify.com/dashboard/applications and start a new app.

Click on Edit Setting and add the following URL to Redirect URLS input field: http://localhost:3000/api/auth/callback/spotify

Click on save.

Open project in code editor, create a file in root directory named .env.local and type in the following text:

NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_CLIENT_SECRET= your client secret here (available at your application created inside https://developer.spotify.com/dashboard/applications)

NEXT_PUBLIC_CLIENT_ID= your client id here (available at your application created inside https://developer.spotify.com/dashboard/applications)

JWT_SECRET=some_super_secret_value

run `npm install`

run `npm run dev`
