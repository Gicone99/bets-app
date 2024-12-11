export default function Logout() {
    if (localStorage.getItem('token')) {
        fetch("http://localhost:3000/logout", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => response.text()).then(data => {
            console.log(data);
            localStorage.removeItem('token');
        });
    } else {
        console.log("no token for logout");
    }
    return (
        <>
        <p>logout</p>
        </>
    )
}