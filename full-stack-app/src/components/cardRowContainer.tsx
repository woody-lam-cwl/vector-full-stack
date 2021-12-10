import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import CardRowContainerProps from '../interfaces/cardRowContainerProps';
import Card from './card';

const containerStyle: React.CSSProperties = {
    display: 'flex',
};

const CardRowContainer = (props: CardRowContainerProps) => {
    return (
        <Droppable
            droppableId={'cardRow-' + props.rowIndex}
            direction="horizontal"
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={containerStyle}
                >
                    {props.cards.map((card) => (
                        <Card
                            key={card.type}
                            data={card}
                            overlayCallback={() => props.overlayCallback(card)}
                        />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default CardRowContainer;
