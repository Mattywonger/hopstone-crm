import { Profile } from "../providers/userProfile";


export const UserBox = () => {
    const { profile } = Profile.useContainer();

    return (
        <div>
            <p>{profile?.firstName}</p>
        </div>
    )
}