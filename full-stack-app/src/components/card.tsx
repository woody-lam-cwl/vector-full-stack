import React from 'react';
import CardProps from '../interfaces/cardProps';
import Image from './image';

const Card = (props: CardProps) => {
    return (
        <div
            style={{
                width: '25%',
                height: 'auto',
                margin: '1%',
                padding: '1.5%',
                textAlign: 'center',
                border: '4px solid #00f',
                borderRadius: '10%',
                userSelect: 'none',
            }}
        >
            <p
                style={{
                    fontSize: '24px',
                    pointerEvents: 'none',
                    margin: '2% 0',
                }}
            >
                {props.title}
            </p>
            <Image src={'/images/' + props.type + '.gif'} type={props.type} />
        </div>
    );
};

export default Card;
