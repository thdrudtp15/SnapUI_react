import './App.css';
import { useSearchParams } from 'react-router';
import { useEffect } from 'react';
import LzString from 'lz-string';

import Header from './components/Header';
import Dashboard from './containers/DashBoard';
import Viewer from './containers/Viewer';

import { tutorialCss } from './constants/tutorialCss';
import { tutorialHtml } from './constants/tutorialHtml';

function App() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tutorial = searchParams.get('html') === 'tutorial';

    useEffect(() => {
        if (tutorial) {
            setSearchParams(
                {
                    html: LzString.compressToEncodedURIComponent(tutorialHtml),
                    css: LzString.compressToEncodedURIComponent(tutorialCss),
                    bg: '#202020',
                },
                { replace: true }
            );
        }
    }, [tutorial]);

    return (
        <>
            <Header />
            <div className="app_container">
                <Dashboard />
                <Viewer />
            </div>
        </>
    );
}

export default App;
