import React from 'react';
import CardProps from '../interfaces/cardProps';

const Card = (props: CardProps) => {
    return (
        <div>
            <h1>{props.title}</h1>
            <img src={'/images/' + props.type + '.gif'} alt={props.type} />
        </div>
    );
};

export default Card;
