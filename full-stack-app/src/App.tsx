import React from 'react';
import CardContainer from './components/cardContainer';
import data from './res/data.json';

function App() {
    return (
        <div>
            <CardContainer cards={data.slice(0, 3)} />
            <CardContainer cards={data.slice(3, 5)} />
        </div>
    );
}

export default App;
