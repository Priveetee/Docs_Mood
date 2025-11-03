# Getting Started

This guide will walk you through setting up your administrator account for the first time.

## Creating the First Account

The Mood application is designed to be managed by a single administrator. Therefore, registration is only open until the first account is created.

1.  **Navigate to the Application**: Open the URL where your Mood application is hosted (e.g., `http://localhost:3000`).
2.  **Access the Registration Form**: If no administrator account exists, you will see a "Sign Up" tab on the login form. Click on it.
3.  **Fill in the Details**:
    - **Email**: Your email address, which will be used to log in.
    - **Username**: Your display name.
    - **Password**: Choose a strong password (minimum 8 characters).
    - **Invitation Key**: Enter the secret `INVITATION_KEY` that was configured in your server's `.env` file. This is a security measure to ensure only an authorized person can create the first account.
4.  **Create Account**: Click the "Create Account" button.

Once your account is created, the registration form will be permanently disabled. All future visits will only show the "Sign In" form. You can now log in to access the administrator dashboard.
