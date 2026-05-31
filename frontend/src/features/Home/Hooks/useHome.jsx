import { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { startSandbox, invokeAi, listFiles, readFileContent, updateFileContent, createFile, deleteFile } from '../service/api';
import { useDispatch } from 'react-redux';
import { addToast } from '../slices/toastSlice';

export const useHome = () => {
    const dispatch = useDispatch();
    const [sandbox, setSandbox] = useState(() => {
        try {
            const item = window.localStorage.getItem('sandbox');
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    });
    const [files, setFiles] = useState(() => {
        try {
            const item = window.localStorage.getItem('files');
            return item ? JSON.parse(item) : [];
        } catch {
            return [];
        }
    });
    const [aiEvents, setAiEvents] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [terminalVersion, setTerminalVersion] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [isLoadingFile, setIsLoadingFile] = useState(false);

    // We keep socket in a ref so we can access it from components without causing re-renders
    const socketRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Sync to localStorage when states change
    useEffect(() => {
        if (sandbox) window.localStorage.setItem('sandbox', JSON.stringify(sandbox));
    }, [sandbox]);

    useEffect(() => {
        window.localStorage.setItem('files', JSON.stringify(files));
    }, [files]);

    const fetchFiles = async (sandboxId) => {
        try {
            const data = await listFiles(sandboxId);
            if (Array.isArray(data)) {
                setFiles(data);
            } else if (data && Array.isArray(data.files)) {
                setFiles(data.files);
            } else if (data && typeof data === 'object') {
                const arrays = Object.values(data).filter(val => Array.isArray(val));
                if (arrays.length > 0) {
                    setFiles(arrays[0]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch files from sandbox api', error);
        }
    };

    const reconnectTerminal = async () => {
        const activeSandbox = sandbox;
        if (!activeSandbox || !activeSandbox.sandboxId) return;

        try {
            // Disconnect old socket if exists
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }

            // Connect to terminal socket
            const socketUrl = `http://${activeSandbox.sandboxId}.agent.localhost`;
            socketRef.current = io(socketUrl, { reconnection: false });

            socketRef.current.on('connect', () => {
                console.log('Terminal socket connected');
            });

            // Trigger CenterZone useEffect re-run
            setTerminalVersion(prev => prev + 1);
        } catch (error) {
            console.error('Failed to reconnect terminal', error);
        }
    };

    const selectFile = async (filePath) => {
        const activeSandbox = sandbox;
        if (!activeSandbox || !activeSandbox.sandboxId) return;

        setSelectedFile(filePath);
        setIsLoadingFile(true);
        try {
            const res = await readFileContent(activeSandbox.sandboxId, filePath);
            if (res && res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
                const contentObj = res.data[0];
                const content = contentObj[filePath] !== undefined
                    ? contentObj[filePath]
                    : Object.values(contentObj)[0] || '';
                setSelectedFileContent(content);
            } else {
                setSelectedFileContent(`Error: Failed to read file.`);
            }
        } catch (error) {
            console.error('Failed to read file content', error);
            setSelectedFileContent(`Error reading file: ${error.message}`);
        } finally {
            setIsLoadingFile(false);
        }
    };

    const saveFile = async (filePath, content) => {
        const activeSandbox = sandbox;
        if (!activeSandbox || !activeSandbox.sandboxId) {
            return { success: false, error: 'No sandbox found.' };
        }

        try {
            const res = await updateFileContent(activeSandbox.sandboxId, filePath, content);
            if (res && res.status === 'success') {
                setSelectedFileContent(content);
                return { success: true };
            } else {
                return { success: false, error: 'Failed to update file content on server.' };
            }
        } catch (error) {
            console.error('Failed to save file content', error);
            return { success: false, error: error.message };
        }
    };

    const createNewFile = async (filePath, type = 'file') => {
        const activeSandbox = sandbox;
        if (!activeSandbox || !activeSandbox.sandboxId) {
            return { success: false, error: 'No sandbox active.' };
        }

        try {
            const res = await createFile(activeSandbox.sandboxId, filePath, type);
            if (res && res.status === 'success') {
                dispatch(addToast({ message: `Successfully created ${filePath.split('/').pop()}`, type: 'success' }));
                await fetchFiles(activeSandbox.sandboxId);
                return { success: true };
            } else {
                if (res && res.message === 'File already exist') {
                    dispatch(addToast({ message: `${type === 'file' ? 'File' : 'Folder'} already exists`, type: 'error' }));
                }
                return { success: false, error: res.message || 'Failed to create.' };
            }
        } catch (error) {
            console.error('Failed to create', error);
            const errMsg = error.response?.data?.message || error.message;
            if (errMsg === 'File already exist' || errMsg === 'File already exists') {
                dispatch(addToast({ message: `${type === 'file' ? 'File' : 'Folder'} already exists`, type: 'error' }));
            }
            return { success: false, error: errMsg };
        }
    };

    const deleteFileOrFolder = async (filePath, type = 'file') => {
        const activeSandbox = sandbox;
        if (!activeSandbox || !activeSandbox.sandboxId) {
            return { success: false, error: 'No sandbox active.' };
        }

        try {
            const res = await deleteFile(activeSandbox.sandboxId, filePath, type);
            if (res && res.status === 'success') {
                dispatch(addToast({ message: `Successfully deleted ${filePath.split('/').pop()}`, type: 'success' }));
                
                // Clear active selected file if it's the deleted file
                if (selectedFile === filePath) {
                    setSelectedFile(null);
                    setSelectedFileContent('');
                }

                await fetchFiles(activeSandbox.sandboxId);
                return { success: true };
            } else {
                return { success: false, error: res.message || 'Failed to delete.' };
            }
        } catch (error) {
            console.error('Failed to delete', error);
            const errMsg = error.response?.data?.message || error.message;
            dispatch(addToast({ message: `Error deleting: ${errMsg}`, type: 'error' }));
            return { success: false, error: errMsg };
        }
    };

    const initWorkspace = async (forceNew = false) => {
        try {
            let data = sandbox;
            if (!data || forceNew) {
                data = await startSandbox();
                setSandbox(data);
            }

            // Connect to terminal socket
            if (data.sandboxId) {
                // Disconnect old socket if exists
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                }

                const socketUrl = `http://${data.sandboxId}.agent.localhost`;
                socketRef.current = io(socketUrl, { reconnection: false });

                socketRef.current.on('connect', () => {
                    console.log('Terminal socket connected');
                });

                // Trigger CenterZone useEffect re-run
                setTerminalVersion(prev => prev + 1);

                // Fetch dynamic files from listFiles API initially
                await fetchFiles(data.sandboxId);
            }
        } catch (error) {
            console.error('Failed to init workspace', error);
        }
    };

    const stopAiResponse = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const sendAiMessage = async (message, agentNo = "1") => {
        if (!sandbox) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsGenerating(true);
        setAiEvents([{ step: 'Initializing AI...', status: 'running', startTime: Date.now() }]);

        try {
            await invokeAi(message, sandbox.sandboxId, agentNo, (eventText) => {
                // Filter timestamps and connection events
                if (eventText === 'Connection closed' || /^\d{2}:\d{2}:\d{2}\.\d{3}$/.test(eventText)) {
                    if (eventText === 'Connection closed') {
                        setIsGenerating(false);
                        setAiEvents(prev => prev.map(ev =>
                            ev.status === 'running' ? { ...ev, status: 'completed', timeTaken: ((Date.now() - ev.startTime) / 1000).toFixed(1) } : ev
                        ));
                        // Fetch files from sandbox API after generation completes
                        fetchFiles(sandbox.sandboxId);
                    }
                    return;
                }

                let cleanText = eventText.trim().replace(/\\n$/, '');
                if (cleanText.startsWith('"') && cleanText.endsWith('"')) {
                    cleanText = cleanText.slice(1, -1);
                }

                if (cleanText.startsWith('Files listed..') || cleanText.startsWith('Files listed...')) {
                    fetchFiles(sandbox.sandboxId);
                }

                // If we receive a new step, mark the previous running step as completed
                setAiEvents(prev => {
                    const updated = prev.map(ev => {
                        if (ev.status === 'running') {
                            return {
                                ...ev,
                                status: 'completed',
                                timeTaken: ((Date.now() - ev.startTime) / 1000).toFixed(1)
                            };
                        }
                        return ev;
                    });

                    // Add the new event as running
                    return [...updated, { step: cleanText, status: 'running', startTime: Date.now() }];
                });
            }, controller.signal);
        } catch (error) {
            console.error("AI Invocation failed:", error);
        } finally {
            if (abortControllerRef.current === controller) {
                setIsGenerating(false);
                setAiEvents(prev => prev.map(ev =>
                    ev.status === 'running' ? { ...ev, status: 'completed', timeTaken: ((Date.now() - ev.startTime) / 1000).toFixed(1) } : ev
                ));
                fetchFiles(sandbox.sandboxId);
            }
        }
    };

    return {
        sandbox,
        files,
        aiEvents,
        isGenerating,
        socketRef,
        terminalVersion,
        reconnectTerminal,
        initWorkspace,
        sendAiMessage,
        stopAiResponse,
        fetchFiles,
        selectedFile,
        selectedFileContent,
        isLoadingFile,
        selectFile,
        saveFile,
        createNewFile,
        deleteFileOrFolder
    };
};