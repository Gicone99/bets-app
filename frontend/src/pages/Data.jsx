import { useEffect, useState } from "react";
import Ticket from "../components/Ticket";

export default function Data() {
  const [data, setData] = useState({});
  const [ticket, setTicket] = useState("");

  useEffect(() => {
    // we do the fetch only if we have a token else there is no point as the server will not deliver
    // in backend we check if the token is set in header under the key: Authorization and if the value starts with Bearer as in the standards of JWT
    if (localStorage.getItem("token")) {
      console.log("effect data here");
      fetch("http://localhost:3001/data", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
        });
    }
  }, []);

  function addTicket(e) {
    e.preventDefault();
    fetch("http://localhost:3001/ticket", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        ticket: ticket,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <>
      {/* here we check if we have a token which we get from /login so it means we are logged in and authorized */}
      {localStorage.getItem("token") ? (
        <div>
          {/* we check if there is any data and send it to Ticket for mapping. 
                if there is no data we print that no tickets were loaded */}
          {data.tickets ? (
            <Ticket tickets={data.tickets} />
          ) : (
            <p>no tickets loaded</p>
          )}

          <form onSubmit={addTicket}>
            Ticket:{" "}
            <input
              type="text"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
            />
            <br />
            <button type="submit">Add</button>
          </form>
        </div>
      ) : (
        <h1>Access Denied!</h1>
      )}
    </>
  );
}
