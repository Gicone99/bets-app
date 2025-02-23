import { Outlet, Link } from "react-router-dom";
export default function Menu() {
  return (
    <div className="menu">
      {/* simple menu with some links. Outlet matches the path from "to" with the element in the index.js */}
      {/* <div>
                <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/logout">Logout</Link> | <Link to="/data">Data</Link>
            </div> */}
      <Outlet />
    </div>
  );
}
