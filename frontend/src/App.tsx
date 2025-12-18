import React from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <PipelineToolbar />
      <div className="flex-1 relative">
        <PipelineUI />
      </div>
      <SubmitButton />
    </div>
  );
}

export default App;
