import React, { useEffect, useState } from "react";
import { Profile } from "../providers/userProfile";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Header from "./header";
import { LoadingPage } from "./LoadingPage";
import { ErrorDisplay } from "./Error";
import { ProfilePicture } from "./ProfilePicture";

export const UserPage = () => {
    const { loading, profile, error, updateProfile, updateProfilePic } = Profile.useContainer();
    const [writeError, setError] = useState<Error | null>(null);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [writing, setWriting] = useState<boolean>(false);

    useEffect(() => {
        if (!loading) {
            setFirstName(profile?.firstName || "");
            setLastName(profile?.lastName || "");
        }
    }, [loading])

    const uploadProfilePic = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setWriting(true);

        if (!event.target.files) {
            //TODO: make sure these update simultaneously
            setError(_ => Error("No picture provided"))
            setWriting(_ => false)
        } else {
            updateProfilePic(event.target.files[0]).catch(setError).finally(() => { setWriting(false) })
        }
    }

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()
        setWriting(true);
        updateProfile({ firstName: firstName, lastName: lastName })
            .catch(setError)
            .finally(() => { setWriting(false) })
    }

    return (
        (loading || writing) ?
            <LoadingPage /> :
            <div>
                <Header />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div>
                        <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: '1.60rem', marginBottom: '35px' }}>Profile</p>
                        <ProfilePicture />
                        <form>
                            <Input type="file" onChange={uploadProfilePic} />
                        </form>
                        <form onSubmit={handleSubmit}>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" type="text" value={firstName} onChange={event => setFirstName(event.target.value)} />
                            <br />
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" type="text" value={lastName} onChange={event => setLastName(event.target.value)} />
                            <br />
                            <Button type="submit" variant="default" style={{ marginTop: '20px' }}>Update</Button>
                        </form>
                        {error && <ErrorDisplay error={error} />}
                        {writeError && <ErrorDisplay error={writeError} />}
                    </div>
                </div>
            </div>
    )
}