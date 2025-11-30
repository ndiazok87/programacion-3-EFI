# Cultivador Pro — Server

Instrucciones rápidas para ejecutar migraciones y levantar el servidor (desarrollo local con SQLite, producción con MySQL).

1) Instala dependencias dentro de `server/`:

```powershell
cd server
npm install
npm install --save-dev sequelize-cli
```

2) Configura variables de entorno (puedes copiar `.env.example`):

```powershell
copy .env.example .env
```

3) En desarrollo (SQLite) simplemente levanta el servidor:

```powershell
npm run dev
```

4) Para usar MySQL (producción) primero instala dependencias y ejecuta migraciones. Establece las variables MySQL y JWT en la sesión o en `server/.env`, por ejemplo usando PowerShell:

```powershell
$env:NODE_ENV = 'production'
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm start
```

Nota: en PowerShell puedes exportar variables con `$env:VAR = 'valor'` para la sesión.

Endpoints adicionales importantes:

- POST /api/auth/forgot-password
  - Body: { "email": "user@example.com" }
  - Env: `SENDGRID_API_KEY` y `SENDGRID_FROM` para enviar email real; si no está configurado el servidor imprimirá el link en la consola.

- POST /api/auth/reset-password
  - Body: { "token": "<token>", "password": "nueva" }

Variables de entorno recomendadas (server/.env):
- MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_PORT
- JWT_SECRET (cambiar en producción)
- SENDGRID_API_KEY (opcional para enviar emails), SENDGRID_FROM (remitente)
- FRONTEND_URL (para construir enlaces en emails; por defecto http://localhost:5173)

Limpieza de paquetes Supabase (si migras del cliente Supabase):
En el root del repo añadí un helper `tools/cleanup-supabase.js` y un script npm `clean-supabase`.
Ejecuta desde la raíz del repo:

```powershell
npm run clean-supabase
# luego (manualmente en PowerShell):
# Remove-Item -Recurse -Force node_modules
# Remove-Item -Force package-lock.json
# npm install
```
# Cultivador Pro — Server

Instrucciones rápidas para ejecutar migraciones y levantar el servidor (desarrollo local con SQLite, producción con MySQL).

1) Instala dependencias dentro de `server/`:

```powershell
cd server
npm install
npm install --save-dev sequelize-cli
```

2) Configura variables de entorno (puedes copiar `.env.example`):

```powershell
copy .env.example .env
# editar .env y poner MYSQL_* cuando uses producción
```

3) En desarrollo (SQLite) simplemente levanta el servidor:

```powershell
npm run dev
```

4) Para usar MySQL (producción) primero instala dependencias y ejecuta migraciones:

```powershell
setx NODE_ENV production
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm start
```

Nota: en PowerShell puedes exportar variables con `$env:MYSQL_HOST = '...'` para la sesión.
