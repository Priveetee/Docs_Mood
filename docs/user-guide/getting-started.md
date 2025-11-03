# Getting Started

This guide will walk you through setting up your administrator account for the first time.

## Creating the First Account

The Mood application is designed to be managed by a single administrator. Therefore, registration is only open until the first account is created.

1.  **Access the Login Page**: Open your browser and navigate directly to the login page. If you are running the application locally, this will be `http://localhost:3000/login`.
2.  **Access the Registration Form**: If no administrator account exists, you will see a "Sign Up" tab on the form. Click on it.
3.  **Fill in the Details**:
    - **Email**: Your email address, which will be used to log in.
    - **Username**: Your display name.
    - **Password**: Choose a strong password (minimum 8 characters).
    - **Invitation Key**: Enter the secret `INVITATION_KEY` that was configured in your server's `.env` file. This is a security measure to ensure only an authorized person can create the first account.
4.  **Create Account**: Click the "Create Account" button.

Once your account is created, the application will log you in and redirect you to the admin dashboard. The registration form will be permanently disabled for all future visitors.
