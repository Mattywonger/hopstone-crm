import { DropdownMenu } from "./ui/dropdown-menu";
import { User } from "../providers/user"
import { signOut } from "@firebase/auth";
import { Button } from "./ui/button";
import React from "react";

const Header = () => {
    const handleLogoClick = () => {
        console.log('Logo clicked'); // When the logo is clicked, I think it would be good to reset the page to the homepage, leave for later
    };

    let { auth, user } = User.useContainer();

    return (
        //sets it to the top
        <header className="fixed top-3 left-0 right-0 z-10 flex justify-between items-center w-full p-5 border-b border-slate-400 bg-white">

            <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                <img src="/images/HopStone_Capital.jpeg" alt="Hopstone Logo" style={{ maxWidth: '100px', maxHeight: '50px' }} />
            </div>

            {/* Container for Register/Login and user icon */}
            <div className="flex items-center">
                <div className="register mr-10">
                    <span>Register/Login</span>
                </div>

                <DropdownMenu>
                    <div className="profile">
                        <img src="/images/unknown-user.png" alt="User Icon" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                    </div>
                    {/* <div className="dropdown-content">
            <a href="/profile">Profile</a>
            <a href="/settings">Settings</a>
            */
                        <div>
                            {user ?
                                <Button onClick={() => { signOut(auth) }}> Log Out </Button> :
                                <React.Fragment>
                                    <a href="/login">Login</a>
                                    <a href="/signup">Signup</a>
                                </React.Fragment>
                            }
                        </div>
            /*
          </div> */}
                </DropdownMenu>
            </div>

        </header>


    );
};

export default Header;