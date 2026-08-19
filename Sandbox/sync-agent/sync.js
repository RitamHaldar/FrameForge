import chokidar from "chokidar";
import {
    BlobServiceClient
} from "@azure/storage-blob";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
dotenv.config();

const blobServiceClient =
    BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING
    );
const containerClient =
    blobServiceClient.getContainerClient(
        process.env.AZURE_STORAGE_CONTAINER_NAME
    );
const projectId = process.env.PROJECT_ID
const localDirectory = "/workspace";

/**async function checkS3ForFiles() {
    console.log(`Checking S3 for existing files in project: ${projectId}`);
    const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: `${projectId}/`
    });
    const listResponse = await s3Client.send(listCommand);
    return listResponse.Contents || [];
}*/

async function checkBlobStorageForFiles() {
    console.log(`Checking Azure Blob Storage for existing files in project: ${projectId}`);
    const files = [];

    // listBlobsFlat returns an async iterable filtered by prefix
    const iterator = containerClient.listBlobsFlat({
        prefix: `${projectId}/`
    });

    for await (const blob of iterator) {
        files.push(blob);
    }

    return files;
}

/**async function downloadFilesFromS3(s3Objects) {
    console.log("Found existing files in S3. Syncing to local directory...");
    for (const file of s3Objects) {
        // Skip if it is a directory placeholder
        if (file.Key.endsWith('/')) continue;

        const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: file.Key
        });
        const getResponse = await s3Client.send(getCommand);

        const relativePath = file.Key.replace(`${projectId}/`, '');
        const localFilePath = path.join(localDirectory, relativePath);

        // Ensure the local directory structure exists
        fs.mkdirSync(path.dirname(localFilePath), { recursive: true });

        const writeStream = fs.createWriteStream(localFilePath);
        getResponse.Body.pipe(writeStream);

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        console.log(`Downloaded ${file.Key} to ${localFilePath}`);
    }
}*/

async function downloadFilesFromBlobStorage(blobs) {
    console.log("Found existing files in Azure Blob Storage. Syncing to local directory...");

    for (const blob of blobs) {
        // Skip if it is a directory placeholder
        if (blob.name.endsWith('/')) continue;

        const relativePath = blob.name.replace(`${projectId}/`, '');
        const localFilePath = path.join(localDirectory, relativePath);

        // Ensure the local directory structure exists
        fs.mkdirSync(path.dirname(localFilePath), { recursive: true });

        // Get a client for the specific blob
        const blobClient = containerClient.getBlobClient(blob.name);

        // Azure SDK provides a built-in method that streams directly to disk
        await blobClient.downloadToFile(localFilePath);

        console.log(`Downloaded ${blob.name} to ${localFilePath}`);
    }
}

/**async function uploadFileToS3(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const relativePath = path.relative(localDirectory, filePath);

        if (filePath.includes('node_modules') || filePath.includes('.env')) {
            return; // Skip syncing node_modules and .env files
        }

        console.log(filePath)
        // Files will have the prefix of projectId
        const s3Key = `${projectId}/${relativePath}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            Body: fileContent
        });

        await s3Client.send(command);
        console.log(`Successfully synced ${filePath} to s3://${bucketName}/${s3Key}`);
    } catch (err) {
        console.error(`Error syncing ${filePath} to S3:`, err);
    }
}*/

async function uploadFileToBlobStorage(filePath) {
    try {
        if (filePath.includes('node_modules') || filePath.includes('.env')) {
            return; // Skip syncing node_modules and .env files
        }

        // Normalize path separators to forward slashes for cloud storage keys
        const relativePath = path.relative(localDirectory, filePath).replace(/\\/g, '/');
        const blobName = `${projectId}/${relativePath}`;

        // Get a BlockBlobClient scoped to the target blob
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Directly upload from disk without loading the entire file into memory
        await blockBlobClient.uploadFile(filePath);

        console.log(`Successfully synced ${filePath} to Azure Blob: ${blobName}`);
    } catch (err) {
        console.error(`Error syncing ${filePath} to Azure Blob Storage:`, err);
    }
}



function startWatcher(hasFiles) {
    console.log("Starting chokidar watch...");
    chokidar.watch(localDirectory, {
        ignored: [
            /(^|[\/\\])\../, // ignore dotfiles
            /node_modules/,  // ignore node_modules completely
            /\.env/          // ignore .env files
        ],
        persistent: true,
        ignoreInitial: hasFiles // if S3 is empty (hasFiles is false), upload all existing local files
    }).on('all', async (event, filePath) => {
        if (event === 'add' || event === 'change') {
            if (filePath.includes('node_modules') || filePath.includes('.env')) {
                return; // Skip syncing node_modules and .env files
            }
            await uploadFileToBlobStorage(filePath);
        }
    });
}

async function init() {
    try {
        console.log("Initializing Azure Blob Storage synchronization...");
        const blobs = await checkBlobStorageForFiles();
        const hasFiles = blobs.length > 0;

        if (hasFiles) {
            await downloadFilesFromBlobStorage(blobs);
        } else {
            console.log("No files found in Azure Blob Storage. Local files will be synced to Blob Storage automatically.");
        }

        startWatcher(hasFiles);
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

init();