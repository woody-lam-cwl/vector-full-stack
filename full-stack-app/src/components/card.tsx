import React from 'react';
import CardProps from '../interfaces/cardProps';

const Card = (props: CardProps) => {
    return (
        <div
            style={{
                width: '300px',
                height: '300px',
                margin: '20px',
                textAlign: 'center',
                border: '5px solid #00f',
                borderRadius: '25px',
            }}
        >
            <p style={{ fontSize: '24px', pointerEvents: 'none' }}>
                {props.title}
            </p>
            <img
                src={'/images/' + props.type + '.gif'}
                alt={props.type}
                style={{
                    width: '200px',
                    height: '200px',
                    userSelect: 'none',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

export default Card;
