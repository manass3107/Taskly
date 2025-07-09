import { Link } from 'react-router-dom';
import { FaWallet, FaTasks, FaUserCircle, FaSignOutAlt, FaClipboardList, FaBriefcase, FaExchangeAlt } from 'react-icons/fa';
import './Navbar.css'; 


const Navbar = ({ user, onLogout }) => {
  const firstLetter = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar__brand">
        Taskly🚀
      </Link>


      <div className="navbar__links">
        <Link to="/open-tasks" className="navbar__link"><FaClipboardList /> Open Tasks</Link>
        <Link to="/my-work" className="navbar__link"><FaBriefcase /> My Work</Link>
        <Link to="/my-posted-contracts" className="navbar__link"><FaTasks /> Contracts</Link>
        <Link to="/wallet" className="navbar__link"><FaWallet /> ₹{user?.walletBalance ?? 0}</Link>

        <Link to="/profile" className="navbar__link">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="navbar__avatar" />
          ) : (
            <div className="navbar__avatar--placeholder">{firstLetter}</div>
          )}
          {user?.name?.split(' ')[0] || 'Profile'}
        </Link>

        <button className="navbar__logout" onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
