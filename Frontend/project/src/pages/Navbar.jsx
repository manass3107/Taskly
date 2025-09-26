import { Link } from 'react-router-dom';
import { FaWallet, FaTasks, FaUserCircle, FaSignOutAlt, FaClipboardList, FaBriefcase, FaExchangeAlt } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
  const firstLetter = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link 
            to="/dashboard" 
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            Taskly🚀
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/open-tasks" 
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <FaClipboardList className="text-purple-400" />
              <span>Open Tasks</span>
            </Link>

            <Link 
              to="/my-work" 
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <FaBriefcase className="text-purple-400" />
              <span>My Work</span>
            </Link>

            <Link 
              to="/my-posted-contracts" 
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <FaTasks className="text-purple-400" />
              <span>Contracts</span>
            </Link>

            <Link 
              to="/wallet" 
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 hover:from-green-400/30 hover:to-emerald-400/30 transition-all duration-300 hover:scale-105"
            >
              <FaWallet />
              <span>₹{user?.walletBalance ?? 0}</span>
            </Link>

            <Link 
              to="/profile" 
              className="flex items-center space-x-3 px-4 py-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border-2 border-purple-400 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                  {firstLetter}
                </div>
              )}
              <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
            </Link>

            <button 
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300 hover:from-red-400/30 hover:to-pink-400/30 transition-all duration-300 hover:scale-105"
              onClick={onLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (Hidden by default - you can add state to toggle) */}
        <div className="md:hidden hidden border-t border-white/20 py-4 space-y-2">
          <Link 
            to="/open-tasks" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
          >
            <FaClipboardList className="text-purple-400" />
            <span>Open Tasks</span>
          </Link>

          <Link 
            to="/my-work" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
          >
            <FaBriefcase className="text-purple-400" />
            <span>My Work</span>
          </Link>

          <Link 
            to="/my-posted-contracts" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
          >
            <FaTasks className="text-purple-400" />
            <span>Contracts</span>
          </Link>

          <Link 
            to="/wallet" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300"
          >
            <FaWallet />
            <span>₹{user?.walletBalance ?? 0}</span>
          </Link>

          <Link 
            to="/profile" 
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
          >
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-purple-400 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                {firstLetter}
              </div>
            )}
            <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
          </Link>

          <button 
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300"
            onClick={onLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;