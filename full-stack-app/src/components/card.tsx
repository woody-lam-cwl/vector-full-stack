import React, { useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { DragDisabledContext, OverlayCallbackContext } from '../app';
import CardProps from '../interfaces/cardProps';
import Image from './image';

const cardStyle: React.CSSProperties = {
    width: '25vw',
    height: 'auto',
    backgroundColor: '#CCCCCC',
    margin: '1vw',
    padding: '1.5vw 0.5vw',
    textAlign: 'center',
    border: '0.3em solid #0000FF',
    borderRadius: '1em',
};

const Card = (props: CardProps) => {
    const isDragDisabled = useContext(DragDisabledContext);
    const overlayCallback = useContext(OverlayCallbackContext);
    return (
        <Draggable
            index={props.position}
            draggableId={props.type}
            isDragDisabled={isDragDisabled}
        >
            {(provided) => {
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
                        onClick={() => overlayCallback(props)}
                    >
                        <p className="fs-3 mt-0 mb-1">{props.title}</p>
                        <Image type={props.type} />
                    </div>
                );
            }}
        </Draggable>
    );
};

export default Card;
