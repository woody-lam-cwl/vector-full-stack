import CardProps from './interfaces/cardProps';

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

const reorderCards = (
    cards: CardProps[],
    destinationIndex: number | undefined,
    sourceIndex: number | undefined
) => {
    if (typeof sourceIndex !== 'number' || typeof destinationIndex !== 'number')
        return null;
    const cardMoved = cards.splice(sourceIndex, 1);
    cards.splice(
        destinationIndex - (sourceIndex < 3 && destinationIndex > 2 ? 1 : 0),
        0,
        ...cardMoved
    );
    cards.map((card, index) => (card.position = index));
    return sortCard(cards);
};

export { timeSince, sortCard, cardsInRows, reorderCards };
