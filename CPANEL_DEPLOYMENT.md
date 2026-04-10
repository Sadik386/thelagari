# cPanel Deployment Guide for Lumina Commerce

This guide explains how to deploy the Lumina Commerce application (React Vite frontend + Node.js Express backend) to a cPanel-based hosting environment.

## Prerequisites

1.  A cPanel hosting account.
2.  Node.js installed on your cPanel server (usually accessible via "Setup Node.js App").
3.  Access to a MongoDB database (e.g., MongoDB Atlas).

---

## 1. Frontend Deployment (React Vite)

### Step A: Build the Project
On your local machine, run the build command:
```bash
npm run build
```
This will create a `dist` folder in your project root.

### Step B: Upload to cPanel
1.  Log in to cPanel and open **File Manager**.
2.  Navigate to `public_html` (or your subdomain folder).
3.  Upload all files from your local `dist` folder into this directory.

### Step C: Configure `.htaccess`
To ensure React Router works correctly (handling page refreshes), create or edit the `.htaccess` file in your `public_html` folder with the following content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 2. Backend Deployment (Node.js Express)

### Step A: Prepare the Server Files
1.  Create a folder named `api` or `server` in your user home directory (e.g., `/home/username/server`).
2.  Upload the contents of your `server` folder (excluding `node_modules`).

### Step B: Setup Node.js App in cPanel
1.  In cPanel, search for **Setup Node.js App**.
2.  Click **Create Application**.
3.  **Node.js version**: Choose a recent version (e.g., 18.x or 20.x).
4.  **Application mode**: Production.
5.  **Application root**: The path to your server folder (e.g., `server`).
6.  **Application URL**: The URL where your API will live (e.g., `yourdomain.com/api`).
7.  **Application startup file**: `index.js`.
8.  Click **Create**.

### Step C: Environment Variables
Inside the "Setup Node.js App" interface, scroll down to **Environment variables** and add:
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure random string.
- `ADMIN_EMAILS`: `mdsiam386siam@gmail.com,test@example.com`
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary name.
- `CLOUDINARY_API_KEY`: Your Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.

### Step D: Install Dependencies
1.  In the same Node.js App interface, click **Run JS Script** or check for a button to **Run npm install**.
2.  Alternatively, use the **Terminal** in cPanel, enter your application root, and run `npm install`.

---

## 3. Connecting Frontend to Backend

Ensure your frontend is pointing to the correct API URL.
1.  In your local project, check `.env.production`.
2.  It should contain: `VITE_API_URL=https://yourdomain.com/api`
3.  Re-build the frontend if you changed this.

---

## 4. Troubleshooting
- **404 on Refresh**: Ensure the `.htaccess` file is correctly placed in `public_html`.
- **Database Connection**: Ensure the server IP of your cPanel hosting is whitelisted in your MongoDB Atlas settings.
- **Images not loading**: Check that Cloudinary credentials are correct in the environment variables.
