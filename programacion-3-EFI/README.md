# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a9bc1889-54f0-4a56-9a67-b30ae3833e8d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a9bc1889-54f0-4a56-9a67-b30ae3833e8d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a9bc1889-54f0-4a56-9a67-b30ae3833e8d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Despliegue (breve guía)

Archivos de entorno de ejemplo se incluyeron: `.env.example` en la raíz (frontend) y `server/.env.example` (backend). Antes de desplegar configura las variables necesarias:

- Frontend: `VITE_API_URL` apuntando a la API en producción (ej. `https://mi-backend.example.com`).
- Backend: `JWT_SECRET`, `DATABASE_URL` (o MYSQL_*), `SENDGRID_API_KEY` (opcional), `SENDGRID_FROM`, `FRONTEND_URL`.

Recomendación de plataformas:
- Backend: Railway, Render o Heroku.
- Base de datos: PlanetScale o Railway (MySQL).
- Frontend: Vercel o Netlify (asegúrate de definir `VITE_API_URL` en las variables de entorno de la plataforma).

Pasos rápidos para desplegar localmente/probar:

```powershell
# instalar dependencias (raíz)
npm install

# arrancar frontend
npm run dev

# backend (desde la carpeta server)
cd server
npm install
npm run dev
```

Si necesitas, puedo generar instrucciones más detalladas para una plataforma concreta (Vercel, Railway, etc.).
