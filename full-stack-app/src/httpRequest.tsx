import axios from 'axios';
import CardProps from './interfaces/cardProps';

const server = axios.create({ baseURL: 'http://localhost:8000' });

const responseHandling = (
    response: any,
    updateCards: (cards: CardProps[]) => void
) => updateCards(response.data as CardProps[]);

const errorHandling = (error: any) => console.log(error);

const getCardsFromServer = (updateCards: (cards: CardProps[]) => void) => {
    server
        .get('')
        .then((response) => responseHandling(response, updateCards))
        .catch((error) => errorHandling(error));
};

const resetCardsToDefault = (updateCards: (cards: CardProps[]) => void) => {
    server
        .post('')
        .then((response) => responseHandling(response, updateCards))
        .catch((error) => errorHandling(error));
};

const updateAllCardsToServer = (cards: CardProps[], callback: () => void) => {
    server
        .put('', cards)
        .then((response) => {
            console.log(response.data);
            setTimeout(callback, 500); //Delay added to demonstrate loading spinner only
        })
        .catch((error) => errorHandling(error));
};

const searchCardByType = (card: CardProps) => {
    server
        .get(`/${card.type}`)
        .then((response) => console.log(response.data))
        .catch((error) => errorHandling(error));
};

const addCardToServer = (card: CardProps) => {
    server
        .post(`/${card.type}`, card)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
};

const updateCardToServer = (card: CardProps) => {
    server
        .put(`/${card.type}`, card)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
};

const deleteCardFromServer = (card: CardProps, callback: () => void) => {
    server
        .delete(`/${card.type}`)
        .then((response) => {
            callback();
            console.log(response.data);
        })
        .catch((error) => console.log(error));
};

export {
    getCardsFromServer,
    resetCardsToDefault,
    updateAllCardsToServer,
    searchCardByType,
    addCardToServer,
    updateCardToServer,
    deleteCardFromServer,
};
