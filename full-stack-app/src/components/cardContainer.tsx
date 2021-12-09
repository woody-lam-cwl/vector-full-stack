import React from 'react';
import CardContainerProps from '../interfaces/cardContainerProps';
import Card from './card';

const CardContainer = (props: CardContainerProps) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {props.cards.map((value) => (
                <Card
                    type={value.type}
                    title={value.title}
                    position={value.position}
                />
            ))}
        </div>
    );
};

export default CardContainer;
