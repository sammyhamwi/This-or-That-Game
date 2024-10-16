const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const session = require('express-session');

const app = express();
const hostname = '0.0.0.0';
const port = 3000;

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 90 * 60 * 1000
    }
}));

app.get('/', (req, res) => {
    if (!req.session.authStatus) {
        return res.redirect('/login');
    }

    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public'), {
    index: false
}));

app.get('/stats', (req, res) => {
    if (!req.session.authStatus || !req.session.authStatsStatus) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/api/validatePassword', async (req, res) => {
    const enteredPassword = req.body.password;

    try {
        const passwordFilePath = path.join(__dirname, 'private', 'password.txt');
        const storedPassword = (await fs.readFile(passwordFilePath, 'utf-8')).trim();

        if (enteredPassword === storedPassword) {
            req.session.authStatus = true;
            res.json({ valid: true });
        } else {
            req.session.authStatus = false;
            res.json({ valid: false });
        }
    } catch (error) {
        console.error('Error reading password file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/validateStatsPassword', async (req, res) => {
    const enteredStatsPassword = req.body.password;

    try {
        const passwordStatsFilePath = path.join(__dirname, 'private', 'stats_password.txt');
        const storedStatsPassword = (await fs.readFile(passwordStatsFilePath, 'utf-8')).trim();

        if (enteredStatsPassword === storedStatsPassword) {
            req.session.authStatsStatus = true;
            res.json({ valid: true });
        } else {
            req.session.authStatsStatus = false;
            res.json({ valid: false });
        }
    } catch (error) {
        console.error('Error reading stats password file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/mediaPairs', async (req, res) => {
    if (!req.session.authStatus) {
        return res.status(403).send('Access denied. User not authenticated.');
    }

    try {
        const pairsDir = path.join(__dirname, 'public', 'media', 'pairs');
        const categories = await fs.readdir(pairsDir);

        const mediaPairs = {};

        for (const category of categories) {
            const categoryPath = path.join(pairsDir, category);
            const files = await fs.readdir(categoryPath);

            const pairNamesPath = path.join(categoryPath, 'pairNames.json');
            let pairNames = {};
            try {
                pairNames = JSON.parse(await fs.readFile(pairNamesPath, 'utf-8'));
            } catch (err) {
                console.error(`Failed to read pairNames.json for category ${category}:`, err);
                continue;
            }

            mediaPairs[category] = [];
            
            for (let i = 0; i < files.length; i += 2) {
                if (files[i + 1]) {
                    const pairKey = `pair${(i / 2) + 1}`;
                    mediaPairs[category].push({
                        level: (i / 2) + 1,
                        media: [
                            `media/pairs/${category}/${files[i]}`,
                            `media/pairs/${category}/${files[i + 1]}`
                        ],
                        names: pairNames[pairKey] ? pairNames[pairKey].names : ["Unknown", "Unknown"]
                    });
                }
            }
        }

        res.json(mediaPairs);
    } catch (error) {
        console.error('Error fetching media pairs:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/votingStats', async (req, res) => {
    if (!req.session.authStatus) {
        return res.status(403).send('Access denied. User not authenticated.');
    }

    try {
        const votesData = await fs.readFile(path.join(__dirname, 'data/votes.json'), 'utf-8');
        const votes = JSON.parse(votesData);
        res.json(votes);
    } catch (error) {
        console.error('Error fetching voting statistics:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/getVotes/:category/:index', async (req, res) => {
    if (!req.session.authStatus) {
        return res.status(403).send('Access denied. User not authenticated.');
    }

    const { category, index } = req.params;
    let votes = {};
    try {
        const data = await fs.readFile(path.join(__dirname, 'data/votes.json'), 'utf-8');
        votes = JSON.parse(data);
    } catch (err) {
        console.error('Error reading votes.json:', err);
    }

    const voteKey = `${category}_${index}`;
    res.json(votes[voteKey] || { vote1: 0, vote2: 0 });
});

app.post('/api/saveVotes', async (req, res) => {
    if (!req.session.authStatus) {
        return res.status(403).send('Access denied. User not authenticated.');
    }

    const { category, index, vote1, vote2 } = req.body;

    let votes = {};
    try {
        const data = await fs.readFile(path.join(__dirname, 'data/votes.json'), 'utf-8');
        votes = JSON.parse(data);
    } catch (err) {
        console.error('Error reading votes.json:', err);
    }

    const voteKey = `${category}_${index}`;

    if (!votes[voteKey]) {
        votes[voteKey] = [];
    }
    
    votes[voteKey].push({ vote1, vote2, timestamp: new Date().toISOString() });

    await fs.writeFile(path.join(__dirname, 'data/votes.json'), JSON.stringify(votes, null, 2));

    res.status(200).send('Votes saved');
});

app.post('/api/clearVotes', (req, res) => {
    if (!req.session.authStatus) {
        return res.status(403).send('Access denied. User not authenticated.');
    }

    fs.writeFile('data/votes.json', '{}', (err) => {
        if (err) {
            return res.status(500).send('Failed to clear votes.');
        }
        res.send('Votes cleared successfully.');
    });
});

app.get('/api/checkStatsAuth', (req, res) => {
    res.json({ authStatsStatus: req.session.authStatsStatus || false });
});

app.get('/api/checkAuth', (req, res) => {
    res.json({ authStatus: req.session.authStatus || false });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out.');
        }
        res.redirect('/login');
    });
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
