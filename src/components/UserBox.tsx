import { signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { Firebase } from "../providers/user"
import { Profile } from "../providers/userProfile"
import { Link } from "react-router-dom";

export const UserBox = () => {
    const { auth } = Firebase.useContainer();
    const { profile } = Profile.useContainer();

    return (
        <div>
            <Link to="/user" ><p>{profile?.firstName}</p></Link>
            <Button onClick={() => signOut(auth)} style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none', color: 'white' }}>
                Log Out
            </Button>
        </div>
    )
}