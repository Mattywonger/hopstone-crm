import { Link } from 'react-router-dom';
import Header from "./header";

export const Home = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="top-right-button">
            <Link to="/add-new-deal">
                <button className="add-new-button">+ Add New</button>
            </Link>
        </div>
        <Header />
    </div>
);
