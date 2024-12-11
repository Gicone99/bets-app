import { useState } from "react"

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");

    function handleSubmit(e) {
        e.preventDefault(); // this blocks the default behavior as we don't want to reload or go somewhere else
        fetch("http://localhost:3000/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {

            // if logged successfully we then get token in a data object which we then store in localstorage
            console.log(data);
            console.log(data.token);
            setToken(data.token);
            console.log(token);
            localStorage.setItem("token", data.token);
        });
    }

    return (
        <>
        {token ? (<p>Token: {localStorage.getItem('token')}</p>) : (<p>No token</p>)}
        <form onSubmit={handleSubmit}>
           username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
           password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
           <button type="submit">Login</button>
        </form>
        </>
    )
}