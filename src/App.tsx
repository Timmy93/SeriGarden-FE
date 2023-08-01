import React from 'react';
import './CSS/App.css';

import {TitleBar} from "./TitleBar";
import {Table} from "./Table";

function App() {
  return (
      <>
        <TitleBar/>
        <div className="App">
          <header className="App-header">
            {<Table/>}
          </header>
        </div>
      </>
  );
}

export default App;
