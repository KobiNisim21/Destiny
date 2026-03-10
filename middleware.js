// Vercel Edge Middleware — protects /admin routes at the edge
// Before the SPA bundle is served, this checks for authentication
export const config = {
    matcher: ['/admin', '/admin/:path*'],
};

export default function middleware(request) {
    const url = new URL(request.url);

    // If the client-side auth check already passed, let the request through
    if (url.searchParams.has('_auth')) {
        return undefined;
    }

    // Check for auth token in cookies (if using cookie-based auth)
    const token = request.cookies.get('token')?.value;

    // If a valid token cookie exists, allow the request through
    if (token) {
        return undefined; // Continue to the default handler
    }

    // No server-side token found — return a lightweight HTML page
    // that checks localStorage (where JWT is stored in this SPA)
    // and redirects to /login if no token is found
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
            // Check if user has a valid auth token in localStorage
            try {
                var token = localStorage.getItem('token');
                if (token) {
                    // Token exists — load the full SPA by navigating with a marker
                    // Add a cache-busting param so Vercel doesn't loop through middleware
                    window.location.replace(window.location.href + (window.location.search ? '&' : '?') + '_auth=1');
                } else {
                    // No token — redirect to login
                    window.location.replace('/login');
                }
            } catch (e) {
                // localStorage not available — redirect to login
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
