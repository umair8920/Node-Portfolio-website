const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    let filePath = '';
    
    // Route handling
    if (req.url === '/' || req.url === '/index') {
        filePath = path.join(__dirname, 'index.html');
    } else if (req.url === '/introduction') {
        filePath = path.join(__dirname, 'introduction.html');
    } else {
        // Serve static files (CSS, JS, images)
        filePath = path.join(__dirname, req.url);
    }
    
    // Get file extension
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'text/plain';
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - Page Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                        h1 { color: #333; }
                    </style>
                </head>
                <body>
                    <h1>404 - Page Not Found</h1>
                    <p>The page you requested could not be found.</p>
                    <a href="/">Go back to home</a>
                </body>
                </html>
            `);
            return;
        }
        
        // Read and serve the file
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    console.log(`Available routes:`);
    console.log(`- http://localhost:${port}/ (index.html)`);
    console.log(`- http://localhost:${port}/introduction (introduction.html)`);
}); 