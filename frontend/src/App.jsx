import React from 'react';
import './App.css';
import Requests from './components/Requests';

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Trip Information Form</h1>
            </header>
            <main>
                <Requests />
            </main>
        </div>
    );
};

export default App;