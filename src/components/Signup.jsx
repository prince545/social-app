import { useState, useContext } from "react";
import { AuthContext } from "../store/user-auth-store";

const Signup = ({ onSuccess }) => {
  const { signup } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = signup(username, password);
    if (success) {
      setError("");
      if (onSuccess) onSuccess();
    } else {
      setError("Username already exists");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" className="btn btn-success w-100">Sign Up</button>
    </form>
  );
};

export default Signup; 