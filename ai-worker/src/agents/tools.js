import axios from "axios";
import { tool } from "langchain/tools"
import * as z from "zod"
export const listFilesTool = tool(
    async ({ }, config) => {
        console.log("list Files called")
        const response = await axios.get(`http://${config.context.projectId}.agent.localhost/api/agent/listFiles`)
        return JSON.stringify(response.data.data)
    }, {
    name: "list_files",
    description: "List all the files in the project directory. This is useful for understanding what files are available to work with.",
    schema: z.object({})
}
)

export const readFilesTool = tool(
    async ({ files = [] }, config) => {
        console.log("read Files called")
        const response = await axios.get(`http://${config.context.projectId}.agent.localhost/api/agent/readFile?files=${files.join(",")}`)
        return JSON.stringify(response.data.data)
    }, {
    name: "read_files",
    description: "Read the contents of specified files. This is useful for understanding the content of files that are relevant to the task at hand.",
    schema: z.object({
        files: z.array(z.string().describe("The list of files absolute paths to read. These should be files that were listed using the list_files tool or created later"))
    })
}
)

export const updateFilesTool = tool(
    async ({ files }, config) => {
        console.log("update Files called")
        const response = await axios.patch(`http://${config.context.projectId}.agent.localhost/api/agent/updateFile`, {
            updates: files
        })
        return JSON.stringify(response.data.data)
    },
    {
        name: "update_files",
        description: "Update the contents of specified files. This is useful for making changes to files based on the requirements of the task at hand. this tool can also use to create new files by providing a new file name in the file field and the content to be added in the content field.",
        schema: z.object({
            files: z.array(z.object({
                file: z.string().describe("The absolute path of the file to update"),
                content: z.string().describe("The new content for the file, the content should support json format.")
            })).describe("The list of files to update and their new contents")
        })
    }
)