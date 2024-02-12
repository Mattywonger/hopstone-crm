import { Profile } from "../providers/userProfile";

export const ProfilePicture = () => {
    const { loading, profile: user } = Profile.useContainer();

    return (
        <div className="profile">
            {!loading && <img src={user?.profile.profilePic} alt="User Icon" className="profile-image" />}
        </div>
    )
}