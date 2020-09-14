const http = require("http");
const httpServerConfig = require("./config/http-server");
const app = require("./app");

const HTTP_PORT = httpServerConfig.port;
const HOST = httpServerConfig.host;

const onError = (server) => (error) => {
    const { port } = server.address();

    if (error.syscall !== "listen") {
        throw error;
    }

    switch (error.code) {
        case "EACCESS":
            console.error(`${port} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = (server, protocol = "http") => () => {
    const { port } = server.address();
    console.log(`${protocol.toUpperCase()} server listening at ${protocol}://${HOST}:${port}/`);
};

const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, HOST);
httpServer.on("error", onError(httpServer));
httpServer.on("listening", onListening(httpServer));
