import React from 'react';
import SchemaBuilder from './components/Schemabuilder';
import './index.css';


function App() {
  return (
    <div className="w-full mx-auto bg-neutral-900 text-white">
      <h1 className="text-2xl font-bold p-4">JSON Schema Builder</h1>
      <SchemaBuilder />
      <div className='bg-black flex justify-center items-center h-10'>
        <p>Build by Abdul Jumail</p>
      </div>
    </div>
  );
}

export default App;
