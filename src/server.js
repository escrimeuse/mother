import {createServer} from 'node:http';
import {httpServerHandler} from 'cloudflare:node'
import {readFileSync} from 'node:fs';

// We import our HTML files so they can be part of the worker bundle and be served directly.
// This isn't really necessary, we could specify these as static assets in the wrangler.jsonc
// file, but I'm just making this complicated because I'm just playing around
import fourOhFour from './404.html';
import index from './index.html';

const ALLOWED_PATHS = ['/', '/index.html'];

const server = createServer((req, res) => {
    if (ALLOWED_PATHS.includes(req.url)) {
        try { 
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(index);
        } catch (error) {
            handleInternalServerError(res, error);
        }
    } else {
        // General 404 handling
        try {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(fourOhFour);
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