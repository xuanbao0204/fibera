import { NextRequest, NextResponse } from "next/server";

import {
    defaultLocale,
    isValidLocale,
} from "@/i18n/config";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const segments = pathname.split("/");
    const firstSegment = segments[1];

    // Đã có locale hợp lệ
    if (isValidLocale(firstSegment)) {
        return NextResponse.next();
    }

    // Tự động thêm locale mặc định
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;

    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};