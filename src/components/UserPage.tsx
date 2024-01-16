import { useEffect, useState } from "react";
import { Profile } from "../providers/userProfile";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Header from "./header";
import { LoadingPage } from "./LoadingPage";
import { ErrorDisplay } from "./Error";

export const UserPage = () => {
    const { loading, profile, updateProfile } = Profile.useContainer();
    const [error, setError] = useState<Error | null>(null);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    useEffect(() => {
        if (!loading) {
            setFirstName(profile?.firstName || "");
            setLastName(profile?.lastName || "");
        }
    }, [loading])

    const handleSubmit = () => { updateProfile({ firstName: firstName, lastName: lastName }) }

    return (
        loading ?
            <LoadingPage /> :
            <div>
                <Header />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div>
                        <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: '1.60rem', marginBottom: '35px' }}>Profile</p>
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
                    </div>
                </div>
            </div>
    )
}