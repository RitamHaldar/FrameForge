import { useEffect, useState } from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle, useDefaultLayout } from 'react-resizable-panels';
import Sidebar from '../components/Sidebar';
import CenterZone from '../components/CenterZone';
import AgentWorkspace from '../components/AgentWorkspace';
import { useHome } from '../Hooks/useHome';

const HorizontalResizeHandle = ({ disabled }) => (
  <PanelResizeHandle 
    disabled={disabled}
    className={`w-3 group flex items-center justify-center cursor-col-resize outline-none z-20 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${disabled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
  >
    <div className="w-0.5 h-12 rounded-full bg-outline-variant/30 group-hover:bg-primary group-active:bg-primary transition-colors shadow-sm"></div>
  </PanelResizeHandle>
);

export default function DashboardPage() {
  const homeState = useHome();
  const [maximizedPanel, setMaximizedPanel] = useState(null);

  useEffect(() => {
    homeState.initWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'dashboard-layout',
    storage: window.localStorage,
  });

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      <div className="h-screen w-full relative bg-surface-dim p-3">
        {/* Ambient Glows */}
        <div className="bg-glow-layer bg-primary-container top-[-200px] left-[-100px]"></div>
        <div className="bg-glow-layer bg-tertiary-container bottom-[-300px] right-[20%] animation-delay-2000"></div>

        <PanelGroup
          orientation="horizontal"
          defaultLayout={defaultLayout}
          onLayoutChanged={onLayoutChanged}
        >
          <Panel 
            defaultSize='25' 
            minSize='15' 
            maxSize='30'
            className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: maximizedPanel ? 0.3 : 1,
              filter: maximizedPanel ? 'blur(4px)' : 'none',
              pointerEvents: maximizedPanel ? 'none' : 'auto'
            }}
          >
            <Sidebar 
              files={homeState.files} 
              selectedFile={homeState.selectedFile}
              onSelectFile={homeState.selectFile}
            />
          </Panel>
          <HorizontalResizeHandle disabled={!!maximizedPanel} />
          <Panel 
            defaultSize='55' 
            minSize='30' 
            maxSize='80'
            style={{
              zIndex: maximizedPanel ? 50 : 1,
              position: 'relative',
              transform: maximizedPanel ? 'none' : undefined
            }}
          >
            <CenterZone 
              sandbox={homeState.sandbox} 
              socketRef={homeState.socketRef} 
              terminalVersion={homeState.terminalVersion}
              reconnectTerminal={homeState.reconnectTerminal}
              fetchFiles={homeState.fetchFiles}
              selectedFile={homeState.selectedFile}
              selectedFileContent={homeState.selectedFileContent}
              isLoadingFile={homeState.isLoadingFile}
              saveFile={homeState.saveFile}
              maximizedPanel={maximizedPanel}
              setMaximizedPanel={setMaximizedPanel}
              files={homeState.files}
              onSelectFile={homeState.selectFile}
              SocketSuggestion={homeState.SocketSuggestion}
            />
          </Panel>
          <HorizontalResizeHandle disabled={!!maximizedPanel} />
          <Panel 
            defaultSize='25' 
            minSize='15' 
            maxSize='40'
            className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: maximizedPanel ? 0.3 : 1,
              filter: maximizedPanel ? 'blur(4px)' : 'none',
              pointerEvents: maximizedPanel ? 'none' : 'auto'
            }}
          >
            <AgentWorkspace
              aiEvents={homeState.aiEvents}
              isGenerating={homeState.isGenerating}
              sendAiMessage={homeState.sendAiMessage}
            />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
