import { Request, Response, NextFunction, RequestHandler } from "express";
import cors from "cors";
import express from 'express';
import expressWs from 'express-ws';
import bodyParser from 'body-parser';
import glob from 'glob';
import * as helpers from './helpers';

const app = express(); // Casting needed for websocket

/**
 * This file sets up API endpoints based on the current folder tree
 *
 * Here's how it works:
 * Consumable JS files named with an HTTP method (all lowercase) are handed the Request and Response parameters from ExpressJS
 * The path of the file is set up as the endpoint on the server, and is set up with the HTTP method indicated by the filename
 *
 * Example:
 * The file `./src/api/data/bugreport/post.js` is set up at `POST https://example.com/data/bugreport/`
 */

//#region Express setup

// Websocket support
expressWs(app);

// Cors setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');

    // Pass to next layer of middleware
    next();
});
//#endregion

//#region Environment variables
const PORT = process.env.PORT || 5000;
const apiPath = process.env.APIPATH || "/api";
const buildPath = process.env.BUILDPATH || "/build";
const devEnv = process.env.environment == "development";
//#endregion

app.listen(PORT, () => {
    console.log(`Ready, listening on port ${PORT}`);
});

let HttpMethodsRegex = /((?:post|get|put|patch|delete|ws)+)(?:.js)/;

function SetupAPI() {
    glob(__dirname + `/**/*.js`, async function (err: Error | null, result: string[]) {
        if (err)
            throw err;

        for (let filePath of result) {

            if (!filePath.includes("node_modules") && helpers.match(filePath, HttpMethodsRegex)) {
                let serverPath = filePath
                    .replace(HttpMethodsRegex, "")
                    .replace(process.cwd(), "")
                    .replace(apiPath, "")
                    .replace(buildPath, "");

                if (helpers.match(serverPath, /{(.+)}\/?$/)) {
                    // Check paths with route params for sibling folders
                    const folderPath = filePath.replace(/{.+}(.+)$/, "\/\*\/");

                    glob(folderPath, (err: Error | null, siblingDir: string[]) => {
                        if (err)
                            throw err;

                        if (siblingDir.length > 1)
                            throw new Error(`Folder representing a route parameter cannot have sibling folders (at ${folderPath})`);
                    });
                }

                // Reformat route params from folder-friendly to express spec
                serverPath = serverPath.replace(/{([^\/]+?)}/g, ":$1");

                const method = helpers.match(filePath, HttpMethodsRegex);
                if (!method) continue;

                console.log(`Setting up ${filePath} as ${method.toUpperCase()} ${serverPath}`);

                const importedModule = await import(filePath);
                
                if(!importedModule.default)
                    throw "Error: no default export was defined in " + filePath;

                const requestHandlers: RequestHandler[] = [importedModule.default];

                // Add file-defined middlewhere here.
                // Middleware must be inserted before any importedModule.default handler.
                if (importedModule.multipartOptions) {
                    requestHandlers.splice(0, 0, importedModule.multipartOptions);
                }

                switch (method) {
                    case "post":
                        app.post(serverPath, requestHandlers);
                        break;
                    case "get":
                        app.get(serverPath, requestHandlers);
                        break;
                    case "put":
                        app.put(serverPath, requestHandlers);
                        break;
                    case "patch":
                        app.patch(serverPath, requestHandlers);
                        break;
                    case "delete":
                        app.delete(serverPath, requestHandlers);
                        break;
                    case "ws":
                        // Untested
                        (app as any).ws(serverPath, importedModule.defaut(expressWs, serverPath));
                        break;
                }
            }
        }
    });
}

SetupAPI();
