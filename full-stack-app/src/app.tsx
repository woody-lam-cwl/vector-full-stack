import React, { createContext, useEffect, useRef, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import _ from 'lodash';
import CardRowContainer from './components/cardRowContainer';
import Image from './components/image';
import {
    getCardsFromServer,
    resetCardsToDefault,
    updateAllCardsToServer,
} from './httpRequest';
import CardData from './interfaces/cardData';
import Loader from 'react-loader-spinner';

const headerBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'monospace',
};

const buttonStyle: React.CSSProperties = {
    margin: '0.5rem',
    padding: '0.4rem 0.8rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#FFFF00',
    backgroundColor: '#00AAEE',
    border: '0.2rem solid #0000EE',
    borderRadius: '0.5rem',
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
    flexDirection: 'column',
    backgroundColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30em',
    height: '30em',
    padding: '1.2rem 0.4rem 0.2rem',
    border: '0.8em solid #222222',
    borderRadius: '2em',
};

const timeSince = (seconds: number) => {
    if (seconds >= 3600) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
    return `${seconds} second${seconds === 1 ? '' : 's'}`;
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

    const resetCards = () => {
        resetCardsToDefault();
        getCardsFromServer(updateCards);
    };

    return (
        <DragDisabledContext.Provider value={isOverlayActive}>
            <React.Fragment>
                <div style={headerBarStyle}>
                    <button style={buttonStyle} onClick={resetCards}>
                        Reset to Default
                    </button>
                    <h1 style={lastUpdateStyle}>
                        Last updated: {timeSince(secondsSinceLastSave)} ago
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
