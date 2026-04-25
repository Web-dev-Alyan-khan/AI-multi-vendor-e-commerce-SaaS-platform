import ImageKit from "imagekit";

const imagekit = new ImageKit({
  // Add NEXT_PUBLIC_ for client-side access
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, 
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // Keep this private (server-side only)
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;