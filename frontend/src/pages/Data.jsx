import { useEffect, useState } from "react";
import Ticket from '../components/Ticket';

export default function Data() {

    const [data, setData] = useState({});
    const [ticket, setTicket] = useState("");
    
    useEffect( () => {
        if (localStorage.getItem('token')) {
            console.log("effect data here");
            fetch("http://localhost:3000/data", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => response.json()).then(data => {
                console.log(data);
                setData(data);
            });
        }
    }, []);

    function addTicket(e) {
        e.preventDefault();
        fetch("http://localhost:3000/ticket", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                ticket: ticket
            })
        }).then(response => response.text()).then(data => {
            console.log(data);
        })
    }

    return (
        <>
        {localStorage.getItem('token') ? (
            <div>
                 {data.tickets ? (<Ticket tickets={data.tickets} />) : (<p>no tickets loaded</p>)}

                 <form onSubmit={addTicket}>
                    Ticket: <input type="text" value={ticket} onChange={(e) => setTicket(e.target.value)} /><br />
                    <button type="submit">Add</button>
                 </form>
            </div>
            ) : (
            <h1>Access Denied!</h1>
            )}

        </>
    )
}