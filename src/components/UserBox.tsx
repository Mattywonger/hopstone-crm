import { signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { Firebase } from "../providers/user"
import { Profile } from "../providers/userProfile"

export const UserBox = () => {
    const { auth } = Firebase.useContainer();
    const { profile } = Profile.useContainer();

    return (
        <div>
            <p>{profile?.firstName}</p>
            <Button onClick={() => signOut(auth)} style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none', color: 'white' }}>
                Log Out
            </Button>
        </div>
    )
}