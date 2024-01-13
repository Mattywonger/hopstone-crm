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
    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");
    let [password, setPassword] = useState("");
    let [confPassword, setConfPassword] = useState("");
    let [error, setError] = useState<Error>();

    const handleSubmit = (event: FormEvent): void => {
        event.preventDefault();

        if (password !== confPassword) {
            setError(new Error('Passwords do not match'));
            return;
        }
        if (firstName === "") {
            setError(new Error('First name cannot be empty'));
            return;
        }

        if (lastName === "") {
            setError(new Error('Last name cannot be empty'));
            return;
        }

        createUserWithEmailAndPassword(auth, email, password).then(user => {
            setDoc(doc(firestore, `users/${user.user?.uid}`),
                {
                    "firstName": firstName,
                    "lastName": lastName
                })
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
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" type="text" onChange={event => setFirstName(event.target.value)} />
                        <br />
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" type="text" onChange={event => setLastName(event.target.value)} />
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
