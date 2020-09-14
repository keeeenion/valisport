const fs = require("fs");
const path = require("path");
const url = require("url");

const publicPath = path.resolve(__dirname, "../public");

const extToContentType = extName => {
    const assignTable = {
        html: "text/html",
        ico: "img/icon",
        js: "text/javascript",
        css: "text/css",
    };

    if (extName in assignTable) {
        return assignTable[extName];
    }
    throw new Error(`${extName} has no content-type`);
};

const staticDataHandler = (req, res) => {
    const { pathname } = url.parse(req.url);
    const fileName =
        pathname.substring(1) === "" ? "index.html" : pathname.substring(1);
    const fileNameExt = path.extname(fileName).substring(1);
    try {
        res.writeHead(200, {
            "Content-Type": extToContentType(fileNameExt),
        });
        return res.end(fs.readFileSync(path.join(publicPath, fileName)));
    } catch (error) {
        if (error.code === "ENOENT") {
            res.writeHead(404);
            return res.end();
        }
        res.writeHead(500);
        res.end(error.message);
    }
};

const appErrorHandler = (err, req, res) => {
    console.error(err);
    res.writeHead(500);
    res.end(err.message);
};

const logRequest = (req) => {
    const { method, url } = req;
    console.log(`${new Date().toUTCString()}: ${method} - ${url}`);
};

const app = (req, res) => {
    logRequest(req);
    try {
        return staticDataHandler(req, res);
    } catch (err) {
        appErrorHandler(err, req, res);
    }
};

module.exports = app;
