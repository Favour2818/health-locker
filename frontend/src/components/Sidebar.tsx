import { FaHome, FaChartPie,FaCog } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
const { pathname } = useLocation();
const linkClass = (route) => `sidebar-link ${pathname === route ? "active" : ""}`;

return (
<aside className="sidebar">
<Link to="/" className={linkClass("/")}>
<FaHome /> <span>Home</span>
</Link>
<Link to="/dashboard" className={linkClass("/dashboard")}>
<FaChartPie /> <span>Dashboard</span>
</Link>
</aside>
);
}

export default Sidebar;
