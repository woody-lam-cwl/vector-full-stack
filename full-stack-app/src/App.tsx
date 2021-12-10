import React from 'react';
import Card from './components/card';
import CardContainer from './components/cardContainer';
import data from './res/data.json';

function App() {
    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}
        >
            {data.map((value) => (
                <Card
                    type={value.type}
                    title={value.title}
                    position={value.position}
                />
            ))}
        </div>
    );
}

export default App;
