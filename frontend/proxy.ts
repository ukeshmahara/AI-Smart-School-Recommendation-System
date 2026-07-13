import { NextResponse, NextRequest } from "next/server";
import { getTokenCookie, getUserData } from "./lib/cookies";

const publicRoutes = ["/login", "/register"];
const adminRoutes = ["/admin"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getTokenCookie();
    const user = await getUserData();

    const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
    if (token && user && isAdminRoute && user.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/register", "/dashboard/:path*", "/login", "/admin/:path*"],
};