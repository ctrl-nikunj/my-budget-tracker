import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-white px-6 py-4 shadow">
      <h1 className="font-bold text-xl">🧾 Budget Tally</h1>
      <div className="flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/reminders">Reminders</Link>
        <Link to="/fds">FDs</Link>
        <Link to="/analytics">Analytics</Link>
      </div>
    </nav>
  );
}
