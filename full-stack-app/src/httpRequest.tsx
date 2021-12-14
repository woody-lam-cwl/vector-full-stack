import axios from 'axios';
import CardData from './interfaces/cardData';

const server = axios.create({ baseURL: 'http://localhost:8000' });

const errorHandling = (error: any) => console.log(error);

const getCardsFromServer = (updateCards: (cards: CardData[]) => void) => {
    server
        .get('')
        .then((response) => {
            const cards = response.data as CardData[];
            updateCards(cards);
        })
        .catch((error) => errorHandling(error));
};

const resetCardsToDefault = () => {
    server
        .post('')
        .then((response) => console.log(response.data))
        .catch((error) => errorHandling(error));
};

const updateAllCardsToServer = (cards: CardData[], callback: () => void) => {
    server
        .put('', cards)
        .then((response) => {
            console.log(response.data);
            setTimeout(callback, 500); //Delay added to demonstrate loading spinner only
        })
        .catch((error) => errorHandling(error));
};

const searchCardByType = (card: CardData) => {
    server
        .get(`/${card.type}`)
        .then((response) => console.log(response.data))
        .catch((error) => errorHandling(error));
};

const addCardToServer = (card: CardData) => {
    server
        .post(`/${card.type}`, card)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
};

const updateCardToServer = (card: CardData) => {
    server
        .put(`/${card.type}`, card)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
};

const deleteCardFromServer = (card: CardData) => {
    server
        .delete(`/${card.type}`)
        .then((response) => console.log(response.data))
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
