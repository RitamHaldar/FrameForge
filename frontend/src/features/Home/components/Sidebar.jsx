import { motion } from 'framer-motion';
import { useState } from 'react';
import { Folder, FileCode2, FileJson, FileImage, FileText, ChevronRight, ChevronDown, File } from 'lucide-react';

const getIcon = (filename) => {
  if (filename.endsWith('.jsx') || filename.endsWith('.js') || filename.endsWith('.ts') || filename.endsWith('.tsx')) return <FileCode2 className="w-4 h-4 text-secondary" />;
  if (filename.endsWith('.json')) return <FileJson className="w-4 h-4 text-tertiary" />;
  if (filename.match(/\.(png|jpe?g|svg|gif|webp)$/)) return <FileImage className="w-4 h-4 text-primary" />;
  if (filename.endsWith('.md') || filename.endsWith('.txt')) return <FileText className="w-4 h-4 text-outline" />;
  return <File className="w-4 h-4 text-outline/50" />;
};

const buildTree = (paths) => {
  const root = {};
  paths.forEach(path => {
    const parts = path.split('/');
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = { 
          name: part, 
          isDir: i < parts.length - 1, 
          fullPath: parts.slice(0, i + 1).join('/'),
          children: {} 
        };
      }
      current = current[part].children;
    }
  });
  return root;
};

const sortNodes = (entries) => {
  return [...entries].sort((a, b) => {
    const nodeA = a[1];
    const nodeB = b[1];
    if (nodeA.isDir && !nodeB.isDir) return -1;
    if (!nodeA.isDir && nodeB.isDir) return 1;
    return nodeA.name.localeCompare(nodeB.name, undefined, { sensitivity: 'base', numeric: true });
  });
};

const FileNode = ({ name, node, depth = 0, selectedFile, onSelectFile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const paddingLeft = depth * 12 + 12;

  if (node.isDir) {
    return (
      <div className="flex flex-col">
        <motion.div 
          onClick={() => setIsOpen(!isOpen)} 
          whileHover={{ x: 4, backgroundColor: '#1b1b1b' }} 
          className="flex items-center gap-1.5 py-1 cursor-pointer text-on-surface rounded-md" 
          style={{ paddingLeft }}
        >
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-outline" /> : <ChevronRight className="w-3.5 h-3.5 text-outline" />}
          <Folder className="w-4 h-4 text-primary/80 fill-primary/10" />
          <span className="font-body-sm text-[13px] select-none">{name}</span>
        </motion.div>
        {isOpen && sortNodes(Object.entries(node.children)).map(([childName, childNode]) => (
          <FileNode 
            key={childName} 
            name={childName} 
            node={childNode} 
            depth={depth + 1} 
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    );
  }

  const isSelected = selectedFile === node.fullPath;

  return (
    <motion.div 
      onClick={() => onSelectFile && onSelectFile(node.fullPath)}
      whileHover={{ x: 4, backgroundColor: '#1f1f1f' }} 
      className={`flex items-center gap-2 py-1.5 cursor-pointer transition-all rounded-md ${isSelected ? 'text-primary font-semibold bg-surface-container-high border-l-2 border-primary pl-2 shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
      style={{ paddingLeft: isSelected ? paddingLeft + 14 : paddingLeft + 16 }}
    >
      {getIcon(name)}
      <span className="font-body-sm text-[13px] select-none">{name}</span>
    </motion.div>
  );
};

export default function Sidebar({ files = [], selectedFile, onSelectFile }) {
  const filteredFiles = files.filter(path => {
    const filename = path.split('/').pop().toLowerCase();
    return filename !== 'dockerfile';
  });
  const tree = buildTree(filteredFiles);

  return (
    <motion.section 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col h-full bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant/35 rounded-xl z-10 shadow-lg overflow-hidden"
    >
      <div className="flex items-center gap-2.5 border-b border-outline-variant/20">
        <img
          src="/logo/logo.png"
          alt="FrameForge Logo"
          style={{ height: '77px' }}
          className="w-auto object-contain"
          draggable={false}
        />
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col py-2 custom-scrollbar">
        <div className="px-3 py-1 text-outline font-label-caps text-[10px] uppercase tracking-wider mb-2">Explorer</div>
        
        {filteredFiles.length === 0 ? (
          <div className="px-4 py-8 text-center text-outline/50 flex flex-col items-center gap-2">
             <span className="material-symbols-outlined text-[32px]">folder_open</span>
             <span className="font-body-sm text-[12px]">Files will appear here</span>
          </div>
        ) : (
          <div className="flex flex-col">
            {sortNodes(Object.entries(tree)).map(([name, node]) => (
              <FileNode 
                key={name} 
                name={name} 
                node={node} 
                depth={0} 
                selectedFile={selectedFile}
                onSelectFile={onSelectFile}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
