import UserProfileOptions from './UserProfileOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLeaf, faCircleXmark, faCalculator, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; 

const Header = () => {

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center w-full border-b bg-gray-800 text-white"
      style={{ padding: '0.10rem 0.8rem' }}>
      <div className="flex items-center">
        <Link to="/" className="logo" style={{ cursor: 'pointer', position: 'relative', top: '-10px' }}>
          <img src="/HopStone_Capital.jpeg" alt="Hopstone Logo" style={{ maxWidth: '150px', maxHeight: '65px' }} />
        </Link>
        <div style={{ borderLeft: '1px solid white', height: '65px', marginLeft: '20px', marginRight: '20px' }}></div>
        <Link to="/" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
          HopStone Capital CRM
        </Link>
        <nav className="ml-14">
          <ul className="flex space-x-20">
            <li>
              <Link to="/live-deals">
                <FontAwesomeIcon icon={faClock}/> Live Deals
              </Link>
            </li>
            <li>
              <Link to="/post-investment">
                <FontAwesomeIcon icon={faLeaf} /> Post Investment
              </Link>
            </li>
            <li>
              <Link to="/rejected">
                <FontAwesomeIcon icon={faCircleXmark}/> Rejected
              </Link>
            </li>
            <li>
              <Link to="/statistics">
                <FontAwesomeIcon icon={faCalculator}/> Statistics
              </Link>
            </li>
            <li>
              <Link to="/news">
                <FontAwesomeIcon icon={faNewspaper}/> News
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center">
        <UserProfileOptions />
      </div>
    </header>
  );
};

export default Header;
