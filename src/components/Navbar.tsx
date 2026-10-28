import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar(){
  const { currentUser, logOut, isManager  } = useAuth();
  const navigate = useNavigate();

 function handleLogOut() {
  logOut();
  navigate('/login');
}
 return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        מה מבשלים היום?
      </Link>
     <div className='navbar-links'>
     <Link to="/recipes">מתכונים</Link>
     <Link to="/menu">תפריט שבועי</Link>
     <Link to="/shopping">רשימת קניות</Link>
       {isManager && (
    <Link to="/recipes/new" className="navbar-add">
      <span className="navbar-add-icon">+</span>
      מתכון חדש
    </Link>
  )}
     </div>
     
      <div className="navbar-user">

        <span>שלום, {currentUser?.name}</span>
        <button className="navbar-logout" onClick={handleLogOut}>
          יציאה
        </button>
      </div>
    </nav>
  );
}


export default Navbar;