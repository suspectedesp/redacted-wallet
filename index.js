const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const port = 1337;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', './index.html'));
});

const server = app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
    openBrowser(`http://localhost:${port}`);
});

function openBrowser(url) {
    const command = process.platform === 'win32' ? 'start' : 'xdg-open';
    spawn(command, [url], { stdio: 'inherit', shell: true });
}