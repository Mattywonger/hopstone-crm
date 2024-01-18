import UserProfileOptions from './UserProfileOptions';

const Header = () => {

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center w-full p-5 border-b bg-gray-800 text-white">
      <div className="flex items-center">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer', position: 'relative', top: '-10px' }}>
          <img src="/HopStone_Capital.jpeg" alt="Hopstone Logo" style={{ maxWidth: '125px', maxHeight: '75px' }} />
        </div>
        <div style={{ borderLeft: '1px solid white', height: '70px', marginLeft: '20px', marginRight: '20px' }}></div>
        <div>
          <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>HopStone Capital CRM</span>
        </div>
        <nav className="ml-14">
          <ul className="flex space-x-20">
            <li><a href="/live-deals">Live Deals</a></li>
            <li><a href="/post-investment">Post Investment</a></li>
            <li><a href="/rejected">Rejected</a></li>
            <li><a href="/statistics">Statistics</a></li>
            <li><a href="/news">News</a></li>
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
