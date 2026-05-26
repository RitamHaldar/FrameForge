import express from "express"
import morgan from "morgan"
import fs from "node:fs/promises"
import path from "node:path"
import { Server } from "socket.io"
import http from "http";
import pty from "node-pty"
const app = express();
const httpserver = http.createServer(app);

const WORKSPACE_DIR = "/workspace";

app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST","PUT","PATCH","DELETE"]
    }
})
app.get("/api/agent/health", (req, res) => {
    res.status(200).json({ status: "Agent server is healthy", service: "agent" });
})

app.get("/api/agent/ready", (req, res) => {
    res.status(200).json({ status: "Agent server is ready", service: "agent" });
})

const shell = process.env.SHELL || 'bash';

// Spawn the PTY process
const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: "/workspace",
});

ptyProcess.onData((data) => {
    io.emit("terminal-output", data);
})
ptyProcess.onExit(({exitCode, signal}) => {
    console.log(`PTY process exited with code: ${exitCode}, signal: ${signal}`);
})

io.on("connection",(socket)=>{
    console.log("New connection",socket.id);
    socket.on("terminal-input",(data)=>{
        ptyProcess.write(data);
    })
    socket.on("disconnect",()=>{
        console.log("Client disconnected",socket.id);
    })
})
/**
 * @route GET /api/agent/listFiles
 * @description Lists all files in the working directory and its subdirectories. Returns a JSON object with the file paths relative to the working directory. exclude directories like node_modules, .git,dist, etc.
 * - eg. {
 *     "files": [
 *         "file1.txt",
 *         "src/file2.txt",
 *         "src/subdir/file3.txt"
 *     ]
 * }
 * @access Public
 */

app.get("/api/agent/listFiles", async (req, res) => {
    const listFiles = async (dir, basedir) => {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        const fileList = [];
        for (const entry of entries) {
            const fullpath = path.join(dir, entry.name);
            const relativepath = path.relative(basedir, fullpath);

            const excludedir = ["node_modules", ".git", ".vscode", "dist", ""];

            if (excludedir.includes(entry.name)) continue;

            if (entry.isDirectory()) {
                const subFiles = await listFiles(fullpath, basedir);
                fileList.push(...subFiles);
            } else {
                fileList.push(relativepath);
            }
        }
        return fileList;
    }
    try {
        const files = await listFiles(WORKSPACE_DIR, WORKSPACE_DIR);
        res.status(200).json({
            message: "Files listed successfully",
            status: "success",
            data: files
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to list files",
            status: "error",
            data: error.message
        });
    }
})

/**
 * @route GET /api/agent/readFile
 * @description Reads a file from the working directory and returns its content.
 * - eg.
 *   {
 *     "/api/agent/readFile?files=file1.txt,src/file2.txt,src/subdir/file3.txt"
 *   }
 * @access Public
 */

app.get("/api/agent/readFile", async (req, res) => {
    const files = req.query.files;
    if (!files) {
        return res.status(400).json({
            message: "Files is required",
            status: "error",
            data: null
        });
    }
    const fileslist = files.split(",");
    const result = await Promise.all(
        fileslist.map(async (file) => {
            try {
                const fullpath = path.join(WORKSPACE_DIR, file);
                const content = await fs.readFile(fullpath, "utf8");
                return {
                    [file.replace(WORKSPACE_DIR, "")]: content
                };
            } catch (error) {
                return {
                    [file.replace(WORKSPACE_DIR, "")]: `Error reading file: ${error.message}`
                };
            }
        })
    );
    res.status(200).json({
        message: "Files read successfully",
        status: "success",
        data: result
    });
})


/**
 * @route PATCH /api/agent/updateFile
 * @description Updates a file with the given content or creates if not exist.
 * - eg.
 *   {
 *     "updates": [
 *       {
 *         "path": "file1.txt",
 *         "content": "Hello, World!"
 *       }
 *     ]
 *   }
 * @access Public
 */

app.patch("/api/agent/updateFile", async (req, res) => {
    const updates = req.body.updates;
    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
            message: "Updates is required and must be an array",
            status: "error",
            data: null
        });
    }
    const result = await Promise.all(
        updates.map(async (update) => {
            const { file, content } = update;
            try {
                const filePath = path.join(WORKSPACE_DIR, file);
                await fs.mkdir(path.dirname(filePath), { recursive: true });
                await fs.writeFile(filePath, content, "utf8");
                return {
                    [filePath]: "File updated successfully"
                };
            } catch (error) {
                return {
                    [filePath]: `Error updating file: ${error.message}`
                };
            }
        })
    );
    res.status(200).json({
        message: "Files updated successfully",
        status: "success",
        data: result
    });
})

/**
 * @route POST /api/agent/createFile
 * @description Creates a file with the given content or creates if not exist.
 * - eg.
 *   {
 *     "files": [
 *       {
 *         "path": "file1.txt",
 *         "content": "Hello, World!"
 *       }
 *     ]
 *   }
 * @access Public
 */

app.post("/api/agent/createFile", async (req, res) => {
    const files = req.body.files;
    if (!files || !Array.isArray(files)) {
        return res.status(400).json({
            message: "Files is required and must be an array",
            status: "error",
            data: null
        });
    }
    const result = await Promise.all(
        files.map(async (file) => {
            const { path, content } = file;
            try {
                const fullpath = path.join(WORKSPACE_DIR, path);
                await fs.mkdir(path.dirname(fullpath), { recursive: true });
                await fs.writeFile(fullpath, content, "utf8");
                return {
                    [fullpath]: "File created successfully"
                }
            } catch (error) {
                return {
                    [path]: `Error creating file: ${error.message}`
                }
            }
        })
    );
    res.status(200).json({
        message: "File created successfully",
        status: "success",
        data: result
    });
})

export default httpserver;
