import { useState } from "react";

export default function Register() {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleRegsiter(e) {
        e.preventDefault();
        fetch("http://localhost:3000/register", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        });
    }

    return (
        <>
        <p>Register page</p>
        <form onSubmit={handleRegsiter}>
            username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
            password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
            <button type="submit">Register</button>
        </form>
        </>
    )
}