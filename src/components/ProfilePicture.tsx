import { Profile } from "../providers/userProfile";

export const ProfilePicture = () => {
    const { loading, profile } = Profile.useContainer();

    return (
        !loading &&
        <div className="profile">
            <img src={profile?.profilePic} alt="User Icon" className="profile-image" />
        </div>
    )
}