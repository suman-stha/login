import React, { useState } from "react";
import api from "./api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/signin", {
        email: form.email,
        password: form.password,
      });

      console.log("Login response:", response.data);

      const token = response.data.token;
      const refreshToken = response.data.refreshToken;

      if (!token) {
        setMessage("Token not found");
        return;
      }

      // ✅ SAVE TOKEN (VERY IMPORTANT)
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      // ✅ Decode JWT
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      const role = decoded.role?.trim();
      console.log("Role:", role);

      // ✅ Redirect based on role
      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (role === "USER") {
        navigate("/user", { replace: true });
      } else {
        setMessage("Role not found in token");
      }

    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await api.post("/signup", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });

      setMessage("Signup successful. Please login.");
      setIsLogin(true);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isLogin ? "Login" : "Signup"}</h2>

        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <>
              <input
                style={styles.input}
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />

              <input
                style={styles.input}
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button style={styles.button} type="submit">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            style={styles.linkButton}
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? " Signup" : " Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f4",
  },
  card: {
    width: "350px",
    padding: "25px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#0d6efd",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  linkButton: {
    border: "none",
    background: "none",
    color: "#0d6efd",
    cursor: "pointer",
  },
  message: {
    marginTop: "12px",
    color: "green",
  },
};

export default LoginPage;