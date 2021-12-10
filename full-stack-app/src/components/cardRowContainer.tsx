import React from 'react';
import CardRowContainerProps from '../interfaces/cardRowContainerProps';
import Card from './card';

const containerStyle: React.CSSProperties = {
    display: 'flex',
};

const CardRowContainer = (props: CardRowContainerProps) => {
    return (
        <div style={containerStyle}>
            {props.cards.map((card) => (
                <Card
                    type={card.type}
                    title={card.title}
                    position={card.position}
                />
            ))}
        </div>
    );
};

export default CardRowContainer;
