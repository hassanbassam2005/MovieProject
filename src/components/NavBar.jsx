import { Link } from "react-router-dom";
import '../css/Navbar.css'
function Nav(){
    return(
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Movies app</Link>
            </div>
            <div className="navbar-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/favorites" className="nav-link">Favorites</Link>
                <Link to="/contact-us" className="nav-link">Contact Us</Link>
            </div>
        </nav>
    )
    
}

export default Nav;