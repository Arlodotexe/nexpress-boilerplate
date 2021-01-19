# NExpress Boilerplate

A boilerplate repo that expidites the process of settings up a new Express server in NodeJS.

These things are configured for you:
- Typescript
- VSCode build tasks
- Environment variables
    - dev / production environments
    - Port config
    - Config options for the default endpoint import flow 
- ExpressJS
- Multer
- Websocket support
- JSON parsing
- Cors configuration
- A streamlined endpoint import flow, that:
    - Imports endpoints automatically, based on folder structure and file name
    - Handles path parameters
    - Supports various HTTP methods (post, get, put, patch, delete) and websockets (ws)
    - Handles multipart form data.

# Make it yours!
1. Clone the repo
2. Delete the `.git` folder
3. Modify it however you want!

# Contribute 
If you want to make this boilerplate better for everyone, open an issue or submit a pull request.

# Setting up endpoints
The default way that this boilerplate sets up endpoints can be changed or removed as you like.

`./src/index.ts` sets up API endpoints based on the folder tree in `./src/api/`

Here's how it works:

Consumable JS files named with an HTTP method (all lowercase) are handed the Request and Response parameters from ExpressJS
The path of the file is set up as the endpoint on the server, and is set up with the HTTP method indicated by the filename

Example:

The file `./src/api/data/bugreport/post.js` is set up at `POST https://example.com/data/bugreport/`