const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/download', (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const cmd = `yt-dlp -j "${url}"`;
    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch video info' });
        }
        try {
            const data = JSON.parse(stdout);
            const formats = data.formats.map(f => ({
                format_id: f.format_id,
                ext: f.ext,
                resolution: f.height || 'audio',
                url: f.url
            }));
            res.json({ title: data.title, formats });
        } catch (parseErr) {
            res.status(500).json({ error: 'Error parsing video data' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});