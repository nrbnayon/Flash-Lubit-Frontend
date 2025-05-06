// import { NextRequest, NextResponse } from "next/server";

// // Define public paths that don't require authentication
// const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

// // Function to check if the path is public
// const isPublicPath = (path: string): boolean => {
//   return PUBLIC_PATHS.some(
//     (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
//   );
// };

// // Check if path is an API route
// const isApiPath = (path: string): boolean => {
//   return path.startsWith("/api/");
// };

// // Check if path is for static assets
// const isStaticAsset = (path: string): boolean => {
//   return (
//     path.startsWith("/_next/") ||
//     path.startsWith("/favicon.ico") ||
//     path.startsWith("/images/") ||
//     path.startsWith("/fonts/")
//   );
// };

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Skip middleware for static assets and API routes
//   if (isStaticAsset(pathname) || isApiPath(pathname)) {
//     return NextResponse.next();
//   }

//   // Check if the path is public
//   if (isPublicPath(pathname)) {
//     return NextResponse.next();
//   }

//   // Get the access token from cookies
//   const accessToken = request.cookies.get("accessToken")?.value;

//   // If no token is found and the path requires authentication, redirect to login
//   if (!accessToken) {
//     const url = new URL("/login", request.url);
//     // url.searchParams.set("from", pathname);
//     return NextResponse.redirect(url);
//   }

//   // Token exists, allow the request to proceed
//   return NextResponse.next();
// }

// // Configure which paths this middleware will run on
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
