import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import CardRowContainerProps from '../interfaces/cardRowContainerProps';
import Card from './card';

const CardRowContainer = (props: CardRowContainerProps) => {
    return (
        <Droppable
            droppableId={'cardRow-' + props.rowIndex}
            direction="horizontal"
        >
            {(provided) => (
                <div
                    className="d-flex"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {props.cards.map((card) => (
                        <Card
                            key={card.type}
                            type={card.type}
                            title={card.title}
                            position={card.position}
                        />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default CardRowContainer;
