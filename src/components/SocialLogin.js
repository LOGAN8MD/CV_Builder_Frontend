import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";  
import axios from "axios";
import { Url } from "../config";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SocialLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const decoded = jwtDecode(response.credential); // FIXED

      const payload = {
        username: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
      };

      const res = await axios.post(`${Url}/api/auth/google-login`, payload);

      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="mt-4">
      <div id="googleBtn"></div>
    </div>
  );
}
