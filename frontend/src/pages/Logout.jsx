export default function Logout() {
  // checking if we have the token which means we are logged in -> then we send it to the server to invalidate it so
  // we then logout but if we don't have a token then we don't need to send anything ofc
  if (localStorage.getItem("token")) {
    fetch("http://localhost:3004/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        localStorage.removeItem("token");
      });
  } else {
    console.log("no token for logout");
  }
  return (
    <>
      <p>logout</p>
    </>
  );
}
