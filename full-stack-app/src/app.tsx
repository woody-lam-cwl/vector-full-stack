import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import CardRowContainer from './components/cardRowContainer';
import CardProps from './interfaces/cardProps';
import data from './res/data.json';

const cardRowsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};

const sortCard = (cards: CardProps[]) =>
    cards.sort((x, y) => (x.position > y.position ? 1 : -1));

const numberOfRows = (length: number) => ((length + 2) / 3) >> 0;

const cardsInRows = (cards: CardProps[]) => {
    var rows: CardProps[][] = [];
    for (var i = 0; i < numberOfRows(cards.length); i++) {
        rows.push(cards.slice(3 * i, 3 * (i + 1)));
    }
    return rows;
};

const App = () => {
    const [cards, updateCards] = useState(sortCard(data));

    const dragEnd = (result: DropResult) => {
        var cardsClone = [...cards];
        const sourceIndex = result.source?.index;
        const destinationIndex = result.destination?.index;
        if (sourceIndex === undefined || destinationIndex === undefined) return;
        const cardMoved = cardsClone.splice(sourceIndex, 1);
        cardsClone.splice(destinationIndex, 0, ...cardMoved);
        cardsClone.map((card, index) => (card.position = index));
        updateCards(sortCard(cardsClone));
    };

    return (
        <DragDropContext onDragEnd={dragEnd}>
            <div style={cardRowsStyle}>
                {cardsInRows(cards).map((cards, index) => (
                    <CardRowContainer
                        key={index}
                        cards={cards}
                        rowIndex={index}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};

export default App;
