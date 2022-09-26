import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function fromStoryblok(request: NextRequest): boolean {
  const referrer = request.headers.get('referer');
  if (!referrer) {
    return false;
  }
  return (
    referrer.startsWith('https://app.storyblok.com') ||
    // When previewing with localhost storyblok has to downgrade to insecure http
    referrer.startsWith('http://app.storyblok.com')
  );
}

export function enterPreview(request: NextRequest): NextResponse | void {
  const isApi = /^\/api/.test(request.nextUrl.pathname);
  /*
    Prevent redirect loop:
      /x (this file)
      /api/enter-preview?slug=x (enter-preview.ts)
      /x redirects to
      /api/enter-preview?slug=x redirects to
      etc.
  */
  if (isApi) {
    return;
  }

  const isPreview = request.cookies.has('__next_preview_data');
  if (!isPreview) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/enter-preview';
    url.search = url.search +=
      '&slug=' + encodeURIComponent(request.nextUrl.pathname.slice(1));
    return NextResponse.redirect(url);
  }
}

export function middleware(request: NextRequest) {
  if (fromStoryblok(request)) {
    return enterPreview(request);
  }
}
