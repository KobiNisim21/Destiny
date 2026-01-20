import app from '../server/index.js';

export default async function handler(req, res) {
    // Vercel serverless function handler
    return app(req, res);
}
