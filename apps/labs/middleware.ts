import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function fromStoryblok(request: NextRequest): boolean {
  const referrer = request.headers.get('referer');
  if (!referrer) {
    return false;
  }
  console.log('referrer', referrer);
  return (
    referrer.startsWith('https://app.storyblok.com') ||
    // When previewing with localhost storyblok has to downgrade to insecure http
    referrer.startsWith('http://app.storyblok.com')
  );
}

function enterPreview(request: NextRequest): NextResponse {
  const isApi = /^\/api/.test(request.nextUrl.pathname);
  if (isApi) {
    console.log('isApi, early return');
    return;
  }

  const isPreview = request.cookies.has('__next_preview_data');
  if (!isPreview) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/enter-preview';
    url.search = url.search +=
      '&slug=' + encodeURIComponent(request.nextUrl.pathname.slice(1));
    console.log('redirecting', url.toString());
    return NextResponse.redirect(url);
  }
}

export function middleware(request: NextRequest) {
  console.log('checking request', request.url);
  if (fromStoryblok(request)) {
    console.log('handling request');
    return enterPreview(request);
  }
}
