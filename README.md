# Financial Matrix Website

This is the frontend for the Financial Matrix application, built with React and Tailwind CSS, and integrated with Supabase for backend services.

## Features

*   User Authentication (Sign Up, Login)
*   Free Bots Section
*   Unlockable Bots Section
*   User Dashboard
*   Admin Dashboard

## Technologies Used

*   React
*   Tailwind CSS
*   Supabase (Authentication, Database, Storage)
*   Vite
*   pnpm

## Setup and Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/maliksaad1/financial-matrix-website-v2.git
    cd financial-matrix-website-v2
    ```
2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```
3.  **Environment Variables**: Create a `.env` file in the root directory and add your Supabase credentials:
    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
4.  **Run in Development Mode**:
    ```bash
    pnpm dev
    ```

## Deployment to GitHub Pages

This project is configured to be deployed to GitHub Pages from the `docs` folder. Follow these steps to deploy:

1.  **Build the project**:
    ```bash
    pnpm build
    ```
    This will generate the static files in the `docs` directory.
2.  **Configure GitHub Pages**: Go to your repository settings on GitHub, navigate to "Pages", and set the source to `master` branch and `/docs` folder.

Your site will be available at `https://maliksaad1.github.io/financial-matrix-website-v2/`.
