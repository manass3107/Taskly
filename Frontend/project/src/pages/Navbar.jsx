import { Link, useLocation } from 'react-router-dom';
import { FaWallet, FaTasks, FaClipboardList, FaBriefcase } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const firstLetter = user?.name?.[0]?.toUpperCase() || '?';

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium
        ${isActive(to)
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
    >
      <Icon className={isActive(to) ? 'text-black' : 'text-gray-400'} />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link
            to="/dashboard"
            className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-xs font-bold">T</div>
            Taskly
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/open-tasks" icon={FaClipboardList} label="Open Tasks" />
            <NavLink to="/my-work" icon={FaBriefcase} label="My Work" />
            <NavLink to="/my-posted-contracts" icon={FaTasks} label="Contracts" />

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            <Link
              to="/wallet"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors text-sm font-medium"
            >
              <FaWallet className="text-green-600" />
              <span>₹{user?.walletBalance ?? 0}</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center ml-2"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-medium text-xs">
                  {firstLetter}
                </div>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-500 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;