import { useState, useRef, useCallback, useEffect } from 'react';
import { startSandbox, invokeAI, connectSocket, sendTerminalInput, fetchFileList, fetchFileContent } from '../services/home.api';

export const useHome = () => {
    // --- Sandbox State ---
    const [sandboxId, setSandboxId] = useState(() => localStorage.getItem('ff_sandbox_id') || null);
    const [previewUrl, setPreviewUrl] = useState(() => localStorage.getItem('ff_preview_url') || null);
    const [isLoadingSandbox, setIsLoadingSandbox] = useState(false);
    const [sandboxError, setSandboxError] = useState(null);

    // --- AI Chat State ---
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem('ff_messages');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [agentSteps, setAgentSteps] = useState([
        { id: 1, label: 'Understand & Parse', status: 'pending', time: null },
        { id: 2, label: 'Component Architecture', status: 'pending', time: null },
        { id: 3, label: 'Build & Implement', status: 'pending', time: null },
        { id: 4, label: 'Verify & Self-Heal', status: 'pending', time: null },
    ]);

    // --- Terminal State ---
    const socketRef = useRef(null);
    const terminalRef = useRef(null);
    const isCreatingRef = useRef(false);

    // --- File Explorer State ---
    const [fileTree, setFileTree] = useState(() => {
        try {
            const saved = localStorage.getItem('ff_file_tree');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    const [selectedFile, setSelectedFile] = useState(() => localStorage.getItem('ff_selected_file') || '');
    const [openFiles, setOpenFiles] = useState(() => {
        try {
            const saved = localStorage.getItem('ff_open_files');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    // --- Editor State ---
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('ff_active_tab') || 'preview'); // 'preview' | 'code'
    const [editorContent, setEditorContent] = useState(() => localStorage.getItem('ff_editor_content') || '');
    const [changedFiles, setChangedFiles] = useState(() => {
        try {
            const saved = localStorage.getItem('ff_changed_files');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    // --- Viewport State ---
    const [viewport, setViewport] = useState(() => localStorage.getItem('ff_viewport') || 'desktop'); // 'desktop' | 'mobile'

    // --- Refs to avoid stale closures in listeners ---
    const selectedFileRef = useRef(selectedFile);
    useEffect(() => {
        selectedFileRef.current = selectedFile;
    }, [selectedFile]);

    // --- Sync states to localStorage ---
    useEffect(() => {
        if (sandboxId) {
            localStorage.setItem('ff_sandbox_id', sandboxId);
        } else {
            localStorage.removeItem('ff_sandbox_id');
        }
    }, [sandboxId]);

    useEffect(() => {
        if (previewUrl) {
            localStorage.setItem('ff_preview_url', previewUrl);
        } else {
            localStorage.removeItem('ff_preview_url');
        }
    }, [previewUrl]);

    useEffect(() => {
        localStorage.setItem('ff_messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('ff_file_tree', JSON.stringify(fileTree));
    }, [fileTree]);

    useEffect(() => {
        localStorage.setItem('ff_selected_file', selectedFile);
    }, [selectedFile]);

    useEffect(() => {
        localStorage.setItem('ff_open_files', JSON.stringify(openFiles));
    }, [openFiles]);

    useEffect(() => {
        localStorage.setItem('ff_active_tab', activeTab);
    }, [activeTab]);

    useEffect(() => {
        localStorage.setItem('ff_editor_content', editorContent);
    }, [editorContent]);

    useEffect(() => {
        localStorage.setItem('ff_changed_files', JSON.stringify(changedFiles));
    }, [changedFiles]);

    useEffect(() => {
        localStorage.setItem('ff_viewport', viewport);
    }, [viewport]);

    // --- Log File Changes ---
    const logFileChange = useCallback((changeData) => {
        console.log('=== FILE CHANGE LOG ===');
        console.log('File:', changeData.path || changeData.name);
        console.log('Action:', changeData.action || 'modified');
        console.log('Content Preview:', changeData.content?.substring(0, 200) || 'N/A');
        console.log('Timestamp:', new Date().toISOString());
        console.log('========================');
    }, []);

    // --- Socket Listeners Setup ---
    const setupSocket = useCallback((socket) => {
        // Clear existing to avoid duplicate events
        socket.off('terminal-output');
        socket.off('file-change');

        // Listen for terminal output with safe retrying write guards
        socket.on('terminal-output', (output) => {
            const term = terminalRef.current;
            if (term && term.element) {
                try {
                    term.write(output);
                } catch (e) {
                    // Retry writing after a brief layout delay
                    setTimeout(() => {
                        try {
                            term.write(output);
                        } catch (err) {
                            // ignore
                        }
                    }, 50);
                }
            } else {
                // Retry writing once terminal ref is ready
                setTimeout(() => {
                    try {
                        if (terminalRef.current && terminalRef.current.element) {
                            terminalRef.current.write(output);
                        }
                    } catch (err) {
                        // ignore
                    }
                }, 100);
            }
            console.log('[Terminal Output]', output);
        });

        // Listen for file changes from agent
        socket.on('file-change', (data) => {
            console.log('[File Change]', data);
            setChangedFiles(prev => {
                const updated = [...prev, data];
                localStorage.setItem('ff_changed_files', JSON.stringify(updated));
                return updated;
            });
            logFileChange(data);

            // Dynamically update the editor content if the modified file is selected
            if (data.path === selectedFileRef.current || data.name === selectedFileRef.current) {
                setEditorContent(data.content || '');
            }

            // Dynamically update the fileTree hierarchy from the file path
            if (data.path) {
                setFileTree(prev => {
                    const updatedTree = addOrUpdateFileInTree(prev, data.path, 'file');
                    localStorage.setItem('ff_file_tree', JSON.stringify(updatedTree));
                    return updatedTree;
                });
            }
        });
    }, [logFileChange]);

    // --- Load File Tree ---
    const loadFileTree = useCallback(async (activeSandboxId) => {
        try {
            const res = await fetchFileList(activeSandboxId);
            if (res && res.status === 'success' && Array.isArray(res.data)) {
                let constructedTree = [];
                res.data.forEach(filePath => {
                    constructedTree = addOrUpdateFileInTree(constructedTree, filePath, 'file');
                });
                setFileTree(constructedTree);
                console.log('[useHome] FileTree loaded dynamically:', constructedTree);
            }
        } catch (err) {
            console.error('[useHome] Failed to load initial file list:', err);
        }
    }, []);

    // Automatically connect socket and load file list whenever sandboxId is active/changed
    useEffect(() => {
        const activeSandboxId = sandboxId;
        if (activeSandboxId) {
            console.log('[useHome] Automatically connecting and loading workspace for:', activeSandboxId);
            
            // Connect socket if not already connected
            if (!socketRef.current || socketRef.current.disconnected) {
                if (socketRef.current) {
                    try {
                        socketRef.current.disconnect();
                    } catch (e) {
                        // ignore
                    }
                }
                const socket = connectSocket(activeSandboxId);
                socketRef.current = socket;
                setupSocket(socket);
            }

            // Load file list dynamically
            loadFileTree(activeSandboxId);
        }
    }, [sandboxId, setupSocket, loadFileTree]);

    // --- Create Sandbox ---
    const createSandbox = useCallback(async (options = { restoreOnly: false }) => {
        const savedSandboxId = localStorage.getItem('ff_sandbox_id') || sandboxId;
        const savedPreviewUrl = localStorage.getItem('ff_preview_url') || previewUrl;

        // If sandbox session already exists, restore it and return
        if (savedSandboxId) {
            console.log('[useHome] Restoring existing sandbox session:', savedSandboxId);
            if (sandboxId !== savedSandboxId) {
                setSandboxId(savedSandboxId);
            }
            if (previewUrl !== savedPreviewUrl) {
                setPreviewUrl(savedPreviewUrl);
            }
            return { success: true, sandboxId: savedSandboxId, previewUrl: savedPreviewUrl };
        }

        if (options.restoreOnly) {
            console.log('[useHome] No existing sandbox found to restore.');
            return;
        }

        if (isCreatingRef.current) {
            console.log('[useHome] Sandbox creation already in progress. Skipping.');
            return;
        }
        isCreatingRef.current = true;
        setIsLoadingSandbox(true);
        setSandboxError(null);
        try {
            const data = await startSandbox();
            if (data.success) {
                setSandboxId(data.sandboxId);
                setPreviewUrl(data.previewUrl);
                localStorage.setItem('ff_sandbox_id', data.sandboxId);
                localStorage.setItem('ff_preview_url', data.previewUrl);
                console.log('[useHome] New sandbox successfully created:', data.sandboxId);
                return data;
            }
        } catch (err) {
            setSandboxError(err.message || 'Failed to create sandbox');
            console.error('[useHome] Sandbox creation failed:', err);
            isCreatingRef.current = false;
        } finally {
            setIsLoadingSandbox(false);
        }
    }, [sandboxId, previewUrl]);

    // --- Send AI Message ---
    const sendMessage = useCallback(async (text, forcedProjectId = null) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, userMessage]);
        setIsGenerating(true);

        // Update agent steps
        setAgentSteps(prev => prev.map((step, i) => {
            if (i === 0) return { ...step, status: 'active', time: '0.4s' };
            return step;
        }));

        try {
            const projectId = forcedProjectId || sandboxId;
            const response = await invokeAI(text, projectId);

            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullResponse = '';

                // Simulate agent steps progressing
                setTimeout(() => {
                    setAgentSteps(prev => prev.map((step, i) => {
                        if (i === 0) return { ...step, status: 'completed', time: '0.4s' };
                        if (i === 1) return { ...step, status: 'active', time: '1.2s' };
                        return step;
                    }));
                }, 1000);

                setTimeout(() => {
                    setAgentSteps(prev => prev.map((step, i) => {
                        if (i <= 1) return { ...step, status: 'completed' };
                        if (i === 2) return { ...step, status: 'active' };
                        return step;
                    }));
                }, 2500);

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    fullResponse += chunk;
                    console.log('[AI Stream]', chunk);
                }

                const agentMessage = {
                    id: Date.now() + 1,
                    role: 'agent',
                    content: fullResponse,
                    timestamp: new Date().toISOString(),
                };
                setMessages(prev => [...prev, agentMessage]);

                // Complete all steps
                setAgentSteps(prev => prev.map(step => ({
                    ...step,
                    status: 'completed',
                    time: step.time || '0.8s'
                })));
            }
        } catch (err) {
            console.error('[useHome] AI invoke failed:', err);
            const errorMessage = {
                id: Date.now() + 1,
                role: 'agent',
                content: 'Failed to process request. Please try again.',
                timestamp: new Date().toISOString(),
                isError: true,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsGenerating(false);
        }
    }, [sandboxId]);

    // --- Terminal Input ---
    const handleTerminalInput = useCallback((input) => {
        if (socketRef.current) {
            sendTerminalInput(socketRef.current, input);
        }
    }, []);

    // --- Reconnect Terminal ---
    const reconnectTerminal = useCallback(() => {
        const activeSandboxId = localStorage.getItem('ff_sandbox_id') || sandboxId;
        if (activeSandboxId) {
            console.log('[useHome] Explicitly reconnecting terminal socket...');
            if (socketRef.current) {
                try {
                    socketRef.current.disconnect();
                } catch (e) {
                    // ignore
                }
            }
            const socket = connectSocket(activeSandboxId);
            socketRef.current = socket;
            setupSocket(socket);

            const term = terminalRef.current;
            if (term) {
                term.writeln('\r\n\x1b[1;33m[System] Terminal connection reset by user. Reconnecting...\x1b[0m');
                term.write(`root@sandbox-pod-${activeSandboxId}:/workspace# `);
            }
        }
    }, [sandboxId, setupSocket]);

    // --- File Selection ---
    const selectFile = useCallback(async (fileName) => {
        setSelectedFile(fileName);
        if (!openFiles.includes(fileName)) {
            setOpenFiles(prev => [...prev, fileName]);
        }
        console.log('[useHome] File selected:', fileName);

        const activeSandboxId = localStorage.getItem('ff_sandbox_id') || sandboxId;
        if (activeSandboxId) {
            try {
                console.log('[useHome] Fetching content for file:', fileName);
                const res = await fetchFileContent(activeSandboxId, fileName);
                if (res && res.status === 'success' && Array.isArray(res.data)) {
                    // Find the file content object in the returned array
                    const fileObj = res.data.find(item => item[fileName] !== undefined);
                    if (fileObj) {
                        setEditorContent(fileObj[fileName]);
                        console.log('[useHome] Monaco editor content updated for:', fileName);
                    }
                }
            } catch (err) {
                console.error('[useHome] Failed to fetch file content:', err);
            }
        }
    }, [sandboxId, openFiles]);

    // --- Toggle folder expansion ---
    const toggleFolder = useCallback((path) => {
        setFileTree(prev => toggleFolderInTree(prev, path));
    }, []);

    // --- Update editor content and log change ---
    const updateEditorContent = useCallback((newContent) => {
        const oldContent = editorContent;
        setEditorContent(newContent);

        const change = {
            file: selectedFile,
            oldContent: oldContent.substring(0, 100),
            newContent: newContent.substring(0, 100),
            timestamp: new Date().toISOString(),
        };
        setChangedFiles(prev => [...prev, change]);
        console.log('[Code Change]', change);
    }, [editorContent, selectedFile]);

    // --- Cleanup socket on unmount ---
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                console.log('[useHome] Socket disconnected on cleanup');
            }
        };
    }, []);

    return {
        // Sandbox
        sandboxId,
        previewUrl,
        isLoadingSandbox,
        sandboxError,
        createSandbox,

        // AI Chat
        messages,
        isGenerating,
        agentSteps,
        sendMessage,

        // Terminal
        terminalRef,
        handleTerminalInput,
        reconnectTerminal,

        // File Explorer
        fileTree,
        selectedFile,
        openFiles,
        selectFile,
        toggleFolder,

        // Editor
        activeTab,
        setActiveTab,
        editorContent,
        updateEditorContent,
        changedFiles,

        // Viewport
        viewport,
        setViewport,
    };
};

// Helper: recursively toggle folder expansion
function toggleFolderInTree(tree, targetPath) {
    return tree.map(node => {
        const currentPath = node.path || node.name;
        if (currentPath === targetPath && node.type === 'folder') {
            return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
            return { ...node, children: toggleFolderInTree(node.children, targetPath) };
        }
        return node;
    });
}

// Helper: recursively add or update a file node in the tree based on path
function addOrUpdateFileInTree(tree, filePath, fileType = 'file') {
    const parts = filePath.split('/');
    
    // Deep clone the tree to avoid direct mutations
    const newTree = JSON.parse(JSON.stringify(tree));
    
    const insert = (nodes, pathParts, currentPath = '') => {
        const currentName = pathParts[0];
        const isLast = pathParts.length === 1;
        const nodePath = currentPath ? `${currentPath}/${currentName}` : currentName;
        
        // Find existing node
        let existingNode = nodes.find(n => n.name === currentName);
        
        if (isLast) {
            if (existingNode) {
                // Update existing file
                existingNode.type = fileType;
                existingNode.path = nodePath;
                if (fileType === 'file') {
                    existingNode.ext = currentName.split('.').pop();
                }
            } else {
                // Add new file/folder node
                const newNode = {
                    name: currentName,
                    type: fileType,
                    path: nodePath,
                };
                if (fileType === 'file') {
                    newNode.ext = currentName.split('.').pop();
                } else {
                    newNode.children = [];
                    newNode.expanded = false;
                }
                nodes.push(newNode);
            }
        } else {
            // It's a folder, must recurse
            if (!existingNode) {
                // Create folder if it doesn't exist
                existingNode = {
                    name: currentName,
                    type: 'folder',
                    expanded: true,
                    path: nodePath,
                    children: []
                };
                nodes.push(existingNode);
            } else if (existingNode.type !== 'folder') {
                // Convert to folder if it was a file (fallback edge case)
                existingNode.type = 'folder';
                existingNode.children = [];
                existingNode.expanded = true;
                existingNode.path = nodePath;
            }
            
            insert(existingNode.children, pathParts.slice(1), nodePath);
        }
    };
    
    insert(newTree, parts);
    return newTree;
}
