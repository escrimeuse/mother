import {createServer} from 'node:http';
import {handleAsNodeRequest} from 'cloudflare:node'
import {readFile} from 'node:fs';
import path from 'node:path';

const hostname = '127.0.0.1';
const port = 3000;

const ALLOWED_PATHS = ['/', '/index.html', '/blah'];

const server = createServer((req, res) => {
    if (ALLOWED_PATHS.includes(req.url)) {
        const htmlPath = path.join(__dirname, req.url === '/' ? '/index.html' : req.url);
        readFile(htmlPath, (error, data) => {
            if (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error\n');
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        });
    } else {
        const htmlPath = path.join(__dirname, '404.html');
        readFile(htmlPath, (error, data) => {
            res.statusCode = 404;
            if (error) {
                res.setHeader('Content-Type', 'text/plain');
                res.end('Not Found\n');
                return;
            } 
            res.end(data);
        });

       
    }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

export default {
    fetch (request) {
        return handleAsNodeRequest(port, request);
    }
}