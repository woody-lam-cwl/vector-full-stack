import CardData from './cardData';

interface OverlayProps {
    isOverlayActive: boolean;
    overlayData: CardData | undefined;
    deleteCardCallback: (card: CardData | undefined) => void;
}

export default OverlayProps;
