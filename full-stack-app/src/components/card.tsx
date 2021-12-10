import React from 'react';
import CardProps from '../interfaces/cardProps';
import Image from './image';

const cardStyle: React.CSSProperties = {
    width: '20vw',
    height: 'auto',
    margin: '0.8vw',
    padding: '0.8vw',
    textAlign: 'center',
    border: '0.3em solid #0000FF',
    borderRadius: '1em',
    pointerEvents: 'none',
    userSelect: 'none',
};

const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.5em',
    fontWeight: 'normal',
    fontFamily: 'monospace',
    margin: '0.3em 0',
};

const Card = (props: CardProps) => {
    return (
        <div style={cardStyle}>
            <h1 style={cardTitleStyle}>{props.title}</h1>
            <Image src={'/images/' + props.type + '.gif'} type={props.type} />
        </div>
    );
};

export default Card;
