const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const JOBS_FILE = path.join(__dirname, 'jobs.json');

// Initialize jobs file if it doesn't exist
if (!fs.existsSync(JOBS_FILE)) {
    fs.writeFileSync(JOBS_FILE, JSON.stringify([]));
}

function getJobs() {
    try {
        const data = fs.readFileSync(JOBS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function saveJob(job) {
    const jobs = getJobs();
    // Prevent duplicates by checking message ID
    if (!jobs.find(j => j.id === job.id)) {
        jobs.push(job);
        fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
    }
}

// Set up WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('\n==================================================================');
    console.log('SCAN THIS QR CODE WITH YOUR WHATSAPP MOBILE APP TO LOGIN:');
    qrcode.generate(qr, { small: true });
    console.log('==================================================================\n');
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready and authenticated!');
});

// Use message_create to catch both sent and received messages
client.on('message_create', async msg => {
    try {
        const chat = await msg.getChat();

        // Target chat: "Job Alerts"
        if (chat.name && chat.name.toLowerCase().includes('job alerts')) {
            console.log(`[Job Alerts] Checking message: ${msg.body.substring(0, 50)}...`);

            const body = msg.body.toLowerCase();

            // Regex to extract URLs
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = msg.body.match(urlRegex);

            if (!urls || urls.length === 0) return; // Ignore if no links

            // Check matching conditions
            // 2028 grads or summer 2027 interns
            const is2028Grad = body.includes('2028');
            const isSummer2027 = body.includes('2027') && (body.includes('summer') || body.includes('intern'));

            if (is2028Grad || isSummer2027) {
                console.log('✅ Found a matching job! Saving...');
                const jobEntry = {
                    id: msg.id.id,
                    timestamp: msg.timestamp * 1000, // convert to ms
                    text: msg.body,
                    links: urls,
                    chatName: chat.name
                };
                saveJob(jobEntry);
            }
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

client.initialize();

// API endpoint to get jobs
app.get('/api/jobs', (req, res) => {
    const jobs = getJobs();
    res.json(jobs);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
