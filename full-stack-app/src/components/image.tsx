import React, { useState } from 'react';
import Loader from 'react-loader-spinner';
import ImageProps from '../interfaces/imageProps';

const spinnerDivStyle: React.CSSProperties = {
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
};

const imageStyle: React.CSSProperties = {
    width: '80%',
    aspectRatio: '1/1',
};

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
                    ...spinnerDivStyle,
                }}
            >
                <Loader
                    type="TailSpin"
                    color="#BFBFBF"
                    height="8vw"
                    width="8vw"
                ></Loader>
            </div>
            <div style={{ display: loading ? 'none' : 'block' }}>
                <img
                    src={'/images/' + props.type + '.gif'}
                    alt={props.type}
                    style={imageStyle}
                    onLoad={imageLoaded}
                />
            </div>
        </React.Fragment>
    );
};

export default Image;
