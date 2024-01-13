import { FormEvent, useState } from 'react';
import { useNavigate } from "react-router"; 
import { Firebase } from "../providers/user";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ErrorDisplay } from './Error';
import LoginSignupHeader from './LoginSignupHeader'; 
import { Button } from './ui/button'; 
import { Input } from './ui/input'; 
import { Label } from './ui/label'; 

export const SignupPage = () => {
    const { auth, firestore } = Firebase.useContainer();
    const navigate = useNavigate(); 

    let [email, setEmail] = useState("");
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [confPassword, setConfPassword] = useState("");
    let [error, setError] = useState<Error>();

    const handleSubmit = (event: FormEvent): void => {
        event.preventDefault();

        if (password !== confPassword) {
            setError(new Error('Passwords do not match'));
            return;
        }
        if (username === "") {
            setError(new Error('Username cannot be empty'));
            return;
        }

        createUserWithEmailAndPassword(auth, email, password).then(user => {
            setDoc(doc(firestore, `users/${user.user?.uid}`), { "username": username })
                .then(() => {
                    navigate("/login"); // Navigate to login page after successful signup
                })
                .catch(setError);
        }).catch(setError);
    }

    return (
        <div>
            <LoginSignupHeader /> 
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 70px)' }}>
                <div>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: '1.60rem', marginBottom: '35px' }}>Sign Up</p>
                    {error && <ErrorDisplay error={error} />}
                    <form onSubmit={handleSubmit}>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="text" onChange={event => setEmail(event.target.value)} />
                        <br />
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" type="text" onChange={event => setUsername(event.target.value)} />
                        <br />
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" onChange={event => setPassword(event.target.value)} />
                        <br />
                        <Label htmlFor="confPassword">Confirm Password</Label>
                        <Input id="confPassword" type="password" onChange={event => setConfPassword(event.target.value)} />
                        <br />
                        <Button type="submit" variant="default" style={{ marginTop: '20px' }}>Submit</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
