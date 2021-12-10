import CardData from './cardData';

interface CardRowContainerProps {
    cards: CardData[];
    rowIndex: number;
    overlayCallback: (card: CardData) => void;
}

export default CardRowContainerProps;
