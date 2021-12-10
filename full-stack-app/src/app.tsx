import React, { createContext, useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import CardRowContainer from './components/cardRowContainer';
import Image from './components/image';
import CardData from './interfaces/cardData';
import data from './res/data.json';

const cardRowsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
};

const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#55555599',
    background: '0.7',
};

const overlayContainerStyle: React.CSSProperties = {
    display: 'flex',
    backgroundColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30em',
    height: '30em',
    border: '0.8em solid #222222',
    borderRadius: '2em',
};

const sortCard = (cards: CardData[]) =>
    cards.sort((x, y) => (x.position > y.position ? 1 : -1));

const numberOfRows = (length: number) => ((length + 2) / 3) >> 0;

const cardsInRows = (cards: CardData[]) => {
    var rows: CardData[][] = [];
    for (var i = 0; i < numberOfRows(cards.length); i++) {
        rows.push(cards.slice(3 * i, 3 * (i + 1)));
    }
    return rows;
};

export const DragDisabledContext = createContext(false);

const App = () => {
    const [cards, updateCards] = useState(sortCard(data));
    const [isOverlayActive, setOverlayActive] = useState(false);
    const [overlayData, updateOverlayData] = useState<CardData>();

    useEffect(() => {
        window.addEventListener('keydown', keyDown);
        return () => {
            window.removeEventListener('keydown', keyDown);
        };
    }, []);

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

    const keyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setOverlayActive(false);
        console.log(event.key);
    };

    const activateOverlay = (card: CardData) => {
        updateOverlayData(card);
        setOverlayActive(true);
    };

    return (
        <DragDisabledContext.Provider value={isOverlayActive}>
            <React.Fragment>
                <DragDropContext onDragEnd={dragEnd}>
                    <div style={cardRowsStyle}>
                        {cardsInRows(cards).map((cards, index) => (
                            <CardRowContainer
                                key={index}
                                cards={cards}
                                rowIndex={index}
                                overlayCallback={activateOverlay}
                            />
                        ))}
                    </div>
                </DragDropContext>

                <div
                    style={{
                        display: isOverlayActive ? 'flex' : 'none',
                        ...overlayStyle,
                    }}
                >
                    <div style={overlayContainerStyle}>
                        <Image type={overlayData?.type || ''} />
                    </div>
                </div>
            </React.Fragment>
        </DragDisabledContext.Provider>
    );
};

export default App;
