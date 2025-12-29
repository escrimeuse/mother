import {createServer} from 'node:http';
import {httpServerHandler} from 'cloudflare:node'
import {readFileSync} from 'node:fs';
import path from 'node:path';

const ALLOWED_PATHS = ['/', '/index.html', '/blah'];

const server = createServer((req, res) => {
    if (ALLOWED_PATHS.includes(req.url)) {
        const htmlPath = path.join('src/', req.url === '/' ? '/index.html' : req.url);

        try { 
            const fileContent = readFileSync(htmlPath, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(fileContent);
        } catch (error) {
            handleInternalServerError(res, error);
        }
    } else {
        // General 404 handling

        const htmlPath = path.join('src/', '404.html');

        try {
            const fileContent = readFileSync(htmlPath, 'utf-8');
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(fileContent);
        } catch (error) {
            handleInternalServerError(res, error);
        }
       
    }
});

function handleInternalServerError(res, error) {
    console.log("Error reading file:", error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error\n');
}

server.listen(8080);

export default httpServerHandler({port: 8080});