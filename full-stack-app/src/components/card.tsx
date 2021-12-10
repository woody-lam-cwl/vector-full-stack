import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import CardProps from '../interfaces/cardProps';
import Image from './image';

const cardStyle: React.CSSProperties = {
    width: '20vw',
    height: 'auto',
    backgroundColor: '#CCCCCC',
    margin: '0.8vw',
    padding: '0.8vw',
    textAlign: 'center',
    border: '0.3em solid #0000FF',
    borderRadius: '1em',
};

const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.5em',
    fontWeight: 'normal',
    fontFamily: 'monospace',
    margin: '0.3em 0',
};

const Card = (props: CardProps) => {
    return (
        <Draggable index={props.position} draggableId={props.type}>
            {(provided, snapshot) => {
                const dynamicCardStyle: React.CSSProperties = {
                    ...cardStyle,
                    ...provided.draggableProps.style,
                };

                return (
                    <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        style={dynamicCardStyle}
                    >
                        <h1 style={cardTitleStyle}>{props.title}</h1>
                        <Image
                            src={'/images/' + props.type + '.gif'}
                            type={props.type}
                        />
                    </div>
                );
            }}
        </Draggable>
    );
};

export default Card;
