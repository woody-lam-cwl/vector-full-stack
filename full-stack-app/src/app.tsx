import React, { createContext, useEffect, useRef, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import _ from 'lodash';
import CardRowContainer from './components/cardRowContainer';
import Image from './components/image';
import {
    getCardsFromServer,
    updateAllCardsToServer,
} from './httpRequest';
import CardData from './interfaces/cardData';
import Loader from 'react-loader-spinner';

const headerBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'monospace',
};


const lastUpdateStyle: React.CSSProperties = {
    margin: '1rem',
    fontSize: '1.4rem',
};

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
    const lastSavedCards = useRef<CardData[]>([]);
    const [secondsSinceLastSave, setSecondsSinceLastSave] = useState(0);
    const [areCardsSaving, setSavingState] = useState(false);
    const [cards, setCards] = useState<CardData[]>([]);
    const [isOverlayActive, setOverlayActive] = useState(false);
    const [overlayData, updateOverlayData] = useState<CardData>();
    const updateCards = (cards: CardData[]) => setCards(sortCard(cards));

    const countUpSeconds = () => {
        if (areCardsSaved()) return;
        setTimeout(
            () => setSecondsSinceLastSave(secondsSinceLastSave + 1),
            1000
        );
    };

    const areCardsSaved = () => {
        if (secondsSinceLastSave % 5 === 0 && secondsSinceLastSave > 0) {
            const cardsChanged = cards.filter(
                (value, index) =>
                    !_.isEqual(value, lastSavedCards.current[index])
            );
            if (cardsChanged.length > 0) {
                setSavingState(true);
                console.log(cardsChanged);
                updateAllCardsToServer(cardsChanged, () =>
                    setSavingState(false)
                );
                lastSavedCards.current = JSON.parse(JSON.stringify(cards));
                setSecondsSinceLastSave(0);
                return true;
            }
        }
        return false;
    };

    // eslint-disable-next-line
    useEffect(countUpSeconds, [secondsSinceLastSave]);

    useEffect(() => {
        window.addEventListener('keydown', keyDown);
        getCardsFromServer((cards) => {
            updateCards(cards);
            lastSavedCards.current = JSON.parse(JSON.stringify(cards));
        });
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
        cardsClone.splice(
            destinationIndex -
                (sourceIndex < 3 && destinationIndex > 2 ? 1 : 0),
            0,
            ...cardMoved
        );
        cardsClone.map((card, index) => (card.position = index));
        updateCards(sortCard(cardsClone));
    };

    const keyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setOverlayActive(false);
    };

    const activateOverlay = (card: CardData) => {
        updateOverlayData(card);
        setOverlayActive(true);
    };

    return (
        <DragDisabledContext.Provider value={isOverlayActive}>
            <React.Fragment>
                <div style={headerBarStyle}>
                    <h1 style={lastUpdateStyle}>
                        Last updated: {secondsSinceLastSave} seconds ago
                    </h1>
                    <div style={{ display: areCardsSaving ? 'flex' : 'none' }}>
                        <Loader
                            type="TailSpin"
                            color="#BFBFBF"
                            height="4vw"
                            width="4vw"
                        />
                    </div>
                </div>
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
