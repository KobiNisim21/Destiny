
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

const router = express.Router();

// Fallback data (Rick Roll as requested/implied in previous turns for testing, but let's use placeholders)
const FALLBACK_VIDEOS = [
    {
        id: '1',
        videoId: 'dQw4w9WgXcQ',
        title: 'Amazing Gameplay 1',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
    },
    {
        id: '2',
        videoId: 'dQw4w9WgXcQ',
        title: 'Amazing Gameplay 2',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
    },
    {
        id: '3',
        videoId: 'dQw4w9WgXcQ',
        title: 'Amazing Gameplay 3',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
    }
];

// Cache mechanism
let cache = {
    data: null,
    lastFetch: 0
};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

router.get('/latest', async (req, res) => {
    try {
        // Return cached data if valid
        if (cache.data && (Date.now() - cache.lastFetch < CACHE_DURATION)) {
            console.log('Serving YouTube videos from cache');
            return res.json(cache.data);
        }

        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            console.warn('YOUTUBE_API_KEY is missing.');
            return res.json(FALLBACK_VIDEOS);
        }

        // 1. Get Channel ID from Handle
        let channelId = null;
        try {
            const channelRes = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=@DanielleDestiny&key=${apiKey}`);
            if (channelRes.data.items && channelRes.data.items.length > 0) {
                channelId = channelRes.data.items[0].id;
                // We can also get uploads playlist ID here
                // const uploadsPlaylistId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;
            }
        } catch (err) {
            console.error('Failed to resolve channel handle:', err.message);
        }

        if (!channelId) {
            // Fallback to search if handle resolution fails 
            // (Or hardcode the ID if known, but let's assume we need to search)
            console.log('Could not resolve channel ID, defaulting to search');
        }

        // 2. Search for latest videos from this channel
        // If we found the channel ID, filter by it. If not, we might be stuck.
        // Let's assume the handle lookup works.

        let videos = [];
        if (channelId) {
            const searchRes = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=6&key=${apiKey}`);
            videos = searchRes.data.items.map(item => ({
                id: item.id.videoId,
                videoId: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url
            }));
        } else {
            // Fallback search by string query if handle failed completely
            const searchRes = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=DanielleDestiny&order=date&type=video&maxResults=6&key=${apiKey}`);
            videos = searchRes.data.items.map(item => ({
                id: item.id.videoId,
                videoId: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url
            }));
        }

        cache.data = videos;
        cache.lastFetch = Date.now();
        console.log('Refreshed YouTube cache with', videos.length, 'videos');
        res.json(videos);

    } catch (error) {
        console.error('Error fetching YouTube videos:', error.message);
        // Serve stale cache if available, otherwise fallback
        if (cache.data) {
            return res.json(cache.data);
        }
        res.json(FALLBACK_VIDEOS);
    }
});

export default router;
