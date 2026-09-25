import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [page, setPage] = useState("dashboard"); 
  const [preFillData, setPreFillData] = useState(null);

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userName", userData.name);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setPage("dashboard");
  };

  const handleReuse = (data) => {
    setPreFillData(data); 
    setPage("dashboard"); // This triggers the switch back to Create Labels
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="app-main">
      {page === "dashboard" ? (
        <Dashboard 
          onLogout={handleLogout} 
          setPage={setPage} // Passed here
          activePage="dashboard"
          preFillData={preFillData}
          clearPreFill={() => setPreFillData(null)}
        />
      ) : (
        <History 
          onLogout={handleLogout} 
          setPage={setPage} // MUST be passed here too to fix your error
          activePage="history"
          onReuse={handleReuse} 
        />
      )}
    </div>
  );
}

export default App;