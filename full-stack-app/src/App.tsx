import React from 'react';
import data from './res/data.json';

import Card from './components/card';

function App() {
    return (
        <div>
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
