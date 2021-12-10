import React, { useState } from 'react';
import CardRowContainer from './components/cardRowContainer';
import CardProps from './interfaces/cardProps';
import data from './res/data.json';

const cardRowsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const sortCard = (cards: CardProps[]) =>
    cards.sort((x, y) => (x.position > y.position ? 1 : -1));

const numberOfRows = (length: number) => (length + 2) / 3;

const cardsInRows = (cards: CardProps[]) => {
    var rows: CardProps[][] = [];
    for (var i = 0; i < numberOfRows(cards.length); i++) {
        rows.push(cards.slice(3 * i, 3 * (i + 1)));
    }
    return rows;
};

const App = () => {
    //eslint-disable-next-line
    const [cards, setCards] = useState(sortCard(data));
    return (
        <div style={cardRowsStyle}>
            {cardsInRows(cards).map((cards) => (
                <CardRowContainer cards={cards} />
            ))}
        </div>
    );
};

export default App;
