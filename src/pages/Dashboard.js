import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Url } from "../config";
import ExistingCVs from "../components/ExistingCVs";
import NewUserLayouts from "../components/NewUserLayouts";

export default function Dashboard() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cvs, setCVs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch CVs
  const loadCVs = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`${Url}/api/cv?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setCVs((prev) => [...prev, ...res.data]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to load CVs:", err);
    } finally {
      setLoading(false);
    }
  }, [page, token, loading, hasMore]);

  useEffect(() => {
    loadCVs();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY + 50 >=
        document.documentElement.scrollHeight
      ) {
        loadCVs();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadCVs]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="p-4">

      {/* ---------------- GLOBAL HEADER (for BOTH dashboards) ---------------- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My CVs</h1>

        <div className="flex gap-3">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/editor/new")}
          >
            + Create CV
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      {/* -------------------------------------------------------------------- */}

      {/* Conditional Render */}
      {cvs.length === 0 ? (
        <NewUserLayouts />
      ) : (
        <ExistingCVs
          cvs={cvs}
          setCVs={setCVs}
          loadCVs={loadCVs}
          hasMore={hasMore}
          token={token}
        />
      )}
    </div>
  );
}
