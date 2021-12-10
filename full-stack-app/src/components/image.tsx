import React, { useState } from 'react';
import Loader from 'react-loader-spinner';
import ImageProps from '../interfaces/imageProps';

const Image = (props: ImageProps) => {
    const [loading, setLoading] = useState(true);

    const imageLoaded = async () => {
        const delay = (time: number) =>
            new Promise((res) => setTimeout(res, time));
        await delay(200); //Delay added to demonstrate loading spinner only
        setLoading(false);
    };

    return (
        <React.Fragment>
            <div
                style={{
                    display: loading ? 'flex' : 'none',
                    height: '80%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                }}
            >
                <Loader
                    type="TailSpin"
                    color="#BFBFBF"
                    height="40%"
                    width="40%"
                ></Loader>
            </div>
            <div style={{ display: loading ? 'none' : 'block' }}>
                <img
                    src={'/images/' + props.type + '.gif'}
                    alt={props.type}
                    style={{
                        width: '80%',
                        aspectRatio: '1/1',
                        pointerEvents: 'none',
                    }}
                    onLoad={imageLoaded}
                />
            </div>
        </React.Fragment>
    );
};

export default Image;
