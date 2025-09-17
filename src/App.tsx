import './App.css';

import Header from './components/Header';
import Dashboard from './containers/DashBoard';
import Viewer from './containers/Viewer';

function App() {
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
