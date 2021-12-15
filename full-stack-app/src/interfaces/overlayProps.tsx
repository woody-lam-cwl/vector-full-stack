import CardProps from './cardProps';

interface OverlayProps {
    isOverlayActive: boolean;
    overlayData: CardProps | undefined;
    deleteCardCallback: (card: CardProps | undefined) => void;
}

export default OverlayProps;
