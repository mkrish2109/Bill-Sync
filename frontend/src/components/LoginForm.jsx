import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", { email, password });

      // Save JWT token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);

      // Redirect based on role
      const role = response.data.user.role;
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "buyer") {
        navigate("/buyer-dashboard");
      } else {
        navigate("/worker-dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed!");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
