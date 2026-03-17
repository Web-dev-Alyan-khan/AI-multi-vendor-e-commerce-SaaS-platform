import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

// Multi-Vendor E-Commerce Platform | Next.js, PostgreSQL, Stripe, Vercel Built a full-stack multi-vendor e-commerce web app with user authentication (Clerk), vendor store management, admin dashboard, subscription billing, and Stripe payments. Implemented background jobs (Innget), cloud image storage (ImageKit), and deployed on Vercel for live access.


// Full-Stack-AI-Multi-Vender-E-comerece-project-next.js-
