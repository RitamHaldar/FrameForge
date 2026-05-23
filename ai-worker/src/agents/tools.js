import axios from "axios";
import { tool } from "langchain/tools"
import * as z from "zod"
export const listFilesTool = tool(
    async ({ }, config) => {
        const response = await axios.get(`http://${config.context.projectId}/api/agent/listFiles`)
        return JSON.stringify(response.data.data)
    }, {
    name: "list_files",
    description: "List all file paths recursively in the project workspace directory, excluding common directories like node_modules, .git, .vscode, and dist. Use this tool at the very beginning of a task to discover the directory structure and identify files available to work with. Returns an array of relative file paths (e.g., ['src/app.js', 'package.json']).",
    schema: z.object({})
}
)

export const readFilesTool = tool(
    async ({ files = [] }, config) => {
        const response = await axios.get(`http://${config.context.projectId}/api/agent/readFile?files=${files.join(",")}`)
        return JSON.stringify(response.data.data)
    }, {
    name: "read_files",
    description: "Read the complete, raw contents of one or more files in the workspace. Always read the contents of relevant files before attempting to modify them to ensure you have correct, up-to-date context. Accepts an array of relative file paths.",
    schema: z.object({
        files: z.array(z.string().describe("An array of file paths relative to the workspace root directory (e.g., ['src/app.js', 'package.json']) that you want to read. Do not use absolute paths."))
    })
}
)

export const updateFilesTool = tool(
    async ({ files = [] }, config) => {
        const response = await axios.patch(`http://${config.context.projectId}/api/agent/updateFile`, {
            updates: files
        })
        return JSON.stringify(response.data.data)
    },
    {
        name: "update_files",
        description: "Create or completely update one or more files in the workspace. This tool performs a full file write, completely overwriting the existing content of the specified files. Do not provide partial edits or git diffs; you must provide the full, final content of the file. Missing parent directories will be created automatically.",
        schema: z.object({
            files: z.array(z.object({
                path: z.string().describe("The file path relative to the workspace root directory (e.g., 'src/components/Button.jsx') where the content should be written. Do not use absolute paths."),
                content: z.string().describe("The full and complete content to write to the file. This completely replaces the existing file content.")
            })).describe("The list of files to update/create along with their full, new contents.")
        })
    }
)