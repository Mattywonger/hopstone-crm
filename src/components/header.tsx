// import { DropdownMenu } from "./ui/dropdown-menu";
// import { User } from "../providers/user"
// import { signOut } from "@firebase/auth";
// import { Button } from "./ui/button";
// import React from "react";

// const Header = () => {
//     const handleLogoClick = () => {
//         console.log('Logo clicked'); // When the logo is clicked, I think it would be good to reset the page to the homepage, leave for later
//     };

//     let { auth, user } = User.useContainer();

//     return (
//         //sets it to the top
//         <header className="fixed top-3 left-0 right-0 z-10 flex justify-between items-center w-full p-5 border-b border-slate-400 bg-white">

//             <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
//                 <img src="/HopStone_Capital.jpeg" alt="Hopstone Logo" style={{ maxWidth: '100px', maxHeight: '50px' }} />
//             </div>

//             {/* Container for Register/Login and user icon */}
//             <div className="flex items-center">
//                 <div className="register mr-10">
//                     <span>Register/Login</span>
//                 </div>

//                 <DropdownMenu>
//                     <div className="profile">
//                         <img src="/unknown-user.png" alt="User Icon" style={{ maxWidth: '50px', maxHeight: '50px' }} />
//                     </div>
//                     {/* <div className="dropdown-content">
//             <a href="/profile">Profile</a>
//             <a href="/settings">Settings</a>
//             */
//                         <div>
//                             {user ?
//                                 <Button onClick={() => { signOut(auth) }}> Log Out </Button> :
//                                 <React.Fragment>
//                                     <a href="/login">Login</a>
//                                     <a href="/signup">Signup</a>
//                                 </React.Fragment>
//                             }
//                         </div>
//             /*
//           </div> */}
//                 </DropdownMenu>
//             </div>

//         </header>


//     );
// };

// export default Header;




import { Button } from "./ui/button";
import { DropdownMenu } from "./ui/dropdown-menu";
import { User } from "../providers/user";
import { signOut } from "@firebase/auth";

const Header = () => {

  let { auth, user } = User.useContainer();

  const handleLogoClick = () => {
    window.location.href = '/';
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center w-full p-5 border-b bg-gray-800 text-white">
      <div className="flex items-center">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src="/images/HopStone_Capital.jpeg" alt="Hopstone Logo" style={{ maxWidth: '125px', maxHeight: '75px' }} />
        </div>

        {/* Vertical Line */}
        <div style={{ borderLeft: '1px solid white', height: '70px', marginLeft: '20px', marginRight: '20px' }}></div>

        {/* CRM Text */}
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
        {user ? (
          <Button onClick={() => signOut(auth)} style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none', color: 'white' }}>
            Log Out
          </Button>
        ) : (
          <div className="register" style={{ marginRight: '10px' }}>
            <a href="/login">Login</a> / <a href="/signup">Signup</a>
          </div>
        )}

        <DropdownMenu>
          <div className="profile">
            <img src="/images/unknown-user.png" alt="User Icon" style={{ maxWidth: '50px', maxHeight: '50px', filter: 'invert(100%)' }} />
          </div>
          {/* Dropdown menu items can be added here */}
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
