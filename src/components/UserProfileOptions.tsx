import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Firebase } from "../providers/user";
import { UserBox } from "./UserBox";
import { Profile } from "../providers/userProfile";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { ProfilePicture } from "./ProfilePicture";
import { LoadingPage } from "./LoadingPage";

const UserProfileOptions = () => {
  const { user, auth } = Firebase.useContainer();
  const navigate = useNavigate(); 


  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/'); // Redirect to homepage after successful logout
    });
  };

  return (
    <>
      <style>
        {`
          .profile-image {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            cursor: pointer;
            filter: invert(100%);
          }
          .profile-image:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
          }
          .logout-item {
            color: red; 
          }
        `}
      </style>
      <div className="flex items-center">
        <div style={{ marginRight: '12px' }}>
          {user && <Profile.Provider><UserBox /></Profile.Provider>}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <>{user ? <Profile.Provider><ProfilePicture /></Profile.Provider> : <LoadingPage />}</>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {user ? (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/user">Update User Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/users">All Users</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout} className="logout-item">Log Out</DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/signup">Signup</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default UserProfileOptions;
