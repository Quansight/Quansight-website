export {};

declare global {
  interface Window {
    // To satisfy TypeScript w.r.t. Google Ads
    dataLayer: any;
  }
}