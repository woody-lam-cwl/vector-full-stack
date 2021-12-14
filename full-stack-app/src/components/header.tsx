import Loader from 'react-loader-spinner';
import { timeSince } from '../appDisplayLogic';
import HeaderProps from '../interfaces/headerProps';

// Reset to Default button included for development use
const Header = (props: HeaderProps) => (
    <div className="d-flex flex-row align-items-center px-4 py-2">
        <button
            className="btn btn-primary mx-2"
            onClick={props.resetCardsCallback}
        >
            Reset to Default
        </button>
        <p className="fs-6 my-auto mx-2">
            Last updated: {timeSince(props.secondsSinceLastSave)} ago
        </p>
        <div style={{ display: props.areCardsSaving ? 'flex' : 'none' }}>
            <Loader type="TailSpin" color="#BFBFBF" height="2vw" width="2vw" />
        </div>
    </div>
);

export default Header;
