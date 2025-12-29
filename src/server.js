import {createServer} from 'node:http';
import {handleAsNodeRequest, httpServerHandler} from 'cloudflare:node'
import {readFileSync} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const hostname = '127.0.0.1';
const port = 3000;

const ALLOWED_PATHS = ['/', '/index.html', '/blah'];


const server = createServer((req, res) => {
    if (ALLOWED_PATHS.includes(req.url)) {
        const htmlPath = path.join('src/', req.url === '/' ? '/index.html' : req.url);
        readFileSync(htmlPath, (error, data) => {
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
        const htmlPath = path.join('src/', '404.html');
        readFileSync(htmlPath, (error, data) => {
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

server.listen(8080);

export default httpServerHandler({port: 8080});