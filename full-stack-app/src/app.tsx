import React, { createContext, useEffect, useRef, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import _ from 'lodash';
import {
    deleteCardFromServer,
    getCardsFromServer,
    resetCardsToDefault,
    updateAllCardsToServer,
} from './httpRequest';
import CardRowContainer from './components/cardRowContainer';
import CardData from './interfaces/cardData';
import { cardsInRows, reorderCards, sortCard } from './appDisplayLogic';
import Header from './components/header';
import Overlay from './components/overlay';

export const DragDisabledContext = createContext(false);

const App = () => {
    const lastSavedCards = useRef<CardData[]>([]);
    const saveCycleInterrupted = useRef(false);
    const [secondsSinceLastSave, setSecondsSinceLastSave] = useState(0);
    const [areCardsSaving, setSavingState] = useState(false);
    const [cards, setCards] = useState<CardData[]>([]);
    const [isOverlayActive, setOverlayActive] = useState(false);
    const [overlayData, updateOverlayData] = useState<CardData>();

    const updateCards = (cards: CardData[]) => setCards(sortCard(cards));
    const updateLastSavedCards = (cards: CardData[]) =>
        (lastSavedCards.current = JSON.parse(JSON.stringify(cards)));
    const updateDisplayAndCachedCards = (cards: CardData[]) => {
        updateCards(cards);
        updateLastSavedCards(cards);
        saveCycleInterrupted.current = true;
    };

    const countUpSeconds = () => {
        if (areCardsSaved()) return;
        setTimeout(
            () => setSecondsSinceLastSave(secondsSinceLastSave + 1),
            1000
        );
    };

    const areCardsSaved = () => {
        if (saveCycleInterrupted.current) {
            setSecondsSinceLastSave(0);
            saveCycleInterrupted.current = false;
            return true;
        }
        if (secondsSinceLastSave % 5 === 0 && secondsSinceLastSave > 0) {
            const cardsChanged = cards.filter(
                (value, index) =>
                    !_.isEqual(value, lastSavedCards.current[index])
            );
            if (cardsChanged.length > 0) {
                setSavingState(true);
                updateAllCardsToServer(cardsChanged, () =>
                    setSavingState(false)
                );
                updateLastSavedCards(cards);
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
        getCardsFromServer(updateDisplayAndCachedCards);
        return () => {
            window.removeEventListener('keydown', keyDown);
        };
        // eslint-disable-next-line
    }, []);

    const dragEnd = (result: DropResult) => {
        const updatedCards = reorderCards(
            [...cards],
            result.destination?.index,
            result.source?.index
        );
        if (updatedCards === null) return;
        updateCards(updatedCards);
    };

    const keyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setOverlayActive(false);
    };

    const activateOverlay = (card: CardData) => {
        updateOverlayData(card);
        setOverlayActive(true);
    };

    const resetCards = () => resetCardsToDefault(updateDisplayAndCachedCards);
    const deleteCard = (card: CardData | undefined) => {
        if (card !== undefined) {
            setOverlayActive(false);
            deleteCardFromServer(card, () =>
                getCardsFromServer(updateDisplayAndCachedCards)
            );
        }
    };

    return (
        <DragDisabledContext.Provider value={isOverlayActive}>
            <React.Fragment>
                <Header
                    resetCardsCallback={resetCards}
                    secondsSinceLastSave={secondsSinceLastSave}
                    areCardsSaving={areCardsSaving}
                ></Header>
                <DragDropContext onDragEnd={dragEnd}>
                    <div className="d-flex flex-column px-5">
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
                <Overlay
                    isOverlayActive={isOverlayActive}
                    overlayData={overlayData}
                    deleteCardCallback={deleteCard}
                />
            </React.Fragment>
        </DragDisabledContext.Provider>
    );
};

export default App;
