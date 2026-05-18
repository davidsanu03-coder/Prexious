# Prexious Vouge - MERN Stack Fashion eCommerce

## CRITICAL SETUP STEP: MongoDB IP Whitelist

The application is running in a dynamic Cloud environment. To connect to MongoDB Atlas, you **MUST** whitelist all IP addresses:

1.  Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2.  Navigate to **Network Access** (under the "Security" section in the sidebar).
3.  Click **Add IP Address**.
4.  Click **ALLOW ACCESS FROM ANYWHERE** (this adds `0.0.0.0/0`).
5.  Click **Confirm**.
6.  Wait about 60 seconds for the change to deploy.

If you don't do this, the application will fail to fetch products or settings.

## Environment Variables (Secrets)

Add these in the **Settings > Secrets** panel:

- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A long random string for auth.
- `PAYSTACK_SECRET_KEY`: Your Paystack secret key.
- `VITE_PAYSTACK_PUBLIC_KEY`: Your Paystack public key.
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Your Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.

## Troubleshooting

### "Cannot set property fetch of #<Window> which has only a getter"
This is a known issue with environment polyfills. We have updated `vite.config.ts` to use `globalThis` which should resolve this. If you still see it, try refreshing the page.
