// Vercel Edge Middleware — handles CORS security and admin route protection
// Runs at the edge BEFORE static files and serverless functions
// This is necessary because Vercel's CDN adds Access-Control-Allow-Origin: * to static files

const ALLOWED_ORIGINS = new Set([
    'https://destiny-rose.vercel.app'
]);

export const config = {
    // Match ALL routes to enforce CORS at the edge level
    matcher: ['/((?!_next/static|_next/image|favicon.ico|destiny-logo-icon.png|destiny-logo-iphone.png|manifest.json|robots.txt|placeholder.svg).*)'],
};

export default async function middleware(request) {
    const url = new URL(request.url);
    const origin = request.headers.get('origin');

    // ───────────────────────────────────────────────────────
    // ADMIN ROUTE PROTECTION
    // ───────────────────────────────────────────────────────
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
        // If the client-side auth check already passed, skip to CORS handling
        if (!url.searchParams.has('_auth')) {
            const token = request.cookies.get('token')?.value;
            if (!token) {
                // Return lightweight auth-check page
                return buildAdminAuthPage();
            }
        }
    }

    // ───────────────────────────────────────────────────────
    // CORS ENFORCEMENT — runs for ALL routes
    // ───────────────────────────────────────────────────────

    // Handle CORS preflight (OPTIONS) requests at the edge
    if (request.method === 'OPTIONS') {
        const corsHeaders = {};
        if (origin && origin !== 'null' && ALLOWED_ORIGINS.has(origin)) {
            corsHeaders['Access-Control-Allow-Origin'] = origin;
            corsHeaders['Access-Control-Allow-Credentials'] = 'true';
            corsHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            corsHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
            corsHeaders['Access-Control-Max-Age'] = '86400';
            corsHeaders['Vary'] = 'Origin';
        }
        // No CORS headers for non-allowed origins — browser will block
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    // For non-OPTIONS requests: fetch the original response, then override CORS headers
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);

    // ALWAYS remove any wildcard CORS header that Vercel's CDN may have added
    newResponse.headers.delete('Access-Control-Allow-Origin');
    newResponse.headers.delete('Access-Control-Allow-Credentials');
    newResponse.headers.delete('Access-Control-Allow-Methods');
    newResponse.headers.delete('Access-Control-Allow-Headers');

    // Only set CORS headers if the origin is in our strict allowlist
    if (origin && origin !== 'null' && ALLOWED_ORIGINS.has(origin)) {
        newResponse.headers.set('Access-Control-Allow-Origin', origin);
        newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
        newResponse.headers.set('Vary', 'Origin');
    }

    return newResponse;
}

// ───────────────────────────────────────────────────────
// Admin auth check page (same as before)
// ───────────────────────────────────────────────────────
function buildAdminAuthPage() {
    const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Destiny - Authentication Required</title>
    <style>
        body {
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #0a0a0a;
            color: #fff;
            font-family: system-ui, -apple-system, sans-serif;
        }
        .loader {
            text-align: center;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(159, 25, 255, 0.2);
            border-top-color: #9F19FF;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 16px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loader">
        <div class="spinner"></div>
        <p>מאמת הרשאות...</p>
    </div>
    <script>
        (function() {
            try {
                var token = localStorage.getItem('token');
                if (token) {
                    window.location.replace(window.location.href + (window.location.search ? '&' : '?') + '_auth=1');
                } else {
                    window.location.replace('/login');
                }
            } catch (e) {
                window.location.replace('/login');
            }
        })();
    </script>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'X-Robots-Tag': 'noindex, nofollow',
        },
    });
}
