import './index.css';

function App() {
  const handleLogin = () => {
    console.log("Redirecting to Login...");
    // Future: window.location.href = "/api/auth/login";
  };

  const handleRegister = () => {
    console.log("Redirecting to Register...");
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="nav-buttons">
          <button className="btn-register" onClick={handleRegister}>Register</button>
          <button className="btn-login" onClick={handleLogin}>Login</button>
        </div>
      </header>

      <main className="main-content">
        <h1>heey we are now having hot relowoding</h1>
        <p>Welcome to your Team Task Board project.</p>
        <div style={{marginTop: '20px', color: '#666'}}>
          Status: Frontend is Connected
        </div>
      </main>
    </div>
  );
}

export default App;