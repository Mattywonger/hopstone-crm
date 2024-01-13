import { useState } from "react";
import { Firebase } from "../providers/user";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import LoginSignupHeader from "./LoginSignupHeader"; 
import { Button } from "./ui/button"; 
import { Input } from "./ui/input"; 
import { Label } from "./ui/label"; 

export const LoginPage = () => {
    const { auth } = Firebase.useContainer();

    let [error, setError] = useState<Error | null>();
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event: any) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => navigate("/"))
            .catch((error: Error) => {
                setError(error);
            });
    }

    return (
        <div>
            <LoginSignupHeader />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: '1.60rem', marginBottom: '35px' }}>Login</p>
                    <form onSubmit={handleSubmit}>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="text" onChange={event => setEmail(event.target.value)} />
                        <br />
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" onChange={event => setPassword(event.target.value)} />
                        <br />
                        <Button type="submit" variant="default" style={{ marginTop: '20px' }}>Submit</Button>
                    </form>
                    {error ?
                        <p>An error occurred: {error.message}</p> :
                        <p></p>
                    }
                </div>
            </div>
        </div>
    );
}
