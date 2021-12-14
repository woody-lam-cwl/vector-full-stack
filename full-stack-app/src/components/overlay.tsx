import OverlayProps from '../interfaces/overlayProps';
import Image from './image';

const overlayContainerStyle: React.CSSProperties = {
    width: '30em',
    height: '30em',
    padding: '1.2rem 0.4rem 0.2rem',
    border: '0.4em solid #222222',
    borderRadius: '2em',
};

const Overlay = (props: OverlayProps) => (
    <div
        className="fixed-top w-100 h-100 align-items-center justify-content-center bg-secondary bg-opacity-50"
        style={{ display: props.isOverlayActive ? 'flex' : 'none' }}
    >
        <div
            className="d-flex flex-column align-items-center justify-content-center bg-light bg-gradient"
            style={overlayContainerStyle}
        >
            <Image type={props.overlayData?.type || ''} />
            <button
                className="btn btn-warning mx-2 mt-4"
                onClick={() => props.deleteCardCallback(props.overlayData)}
            >
                Delete Card
            </button>
        </div>
    </div>
);

export default Overlay;
