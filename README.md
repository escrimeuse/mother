# Personal Website

## Description

This is my personal website playground. 

## Local dev

```bash
npm run start
```

The worker entrypoint is in `server.js`, which is a bare-bones Node.js HTTP server using Cloudflare. It specifically is using Cloudflare Worker's Node.js compatibility (see https://developers.cloudflare.com/workers/runtime-apis/nodejs/). 

## Deployment

This repo is set up to automatically deploy whenever there is a push to `main`. 