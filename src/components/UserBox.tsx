import { Profile } from "../providers/userProfile";


export const UserBox = () => {
    const { profile: user } = Profile.useContainer();

    return (
        <div>
            <p>{user?.profile.firstName}</p>
        </div>
    )
}