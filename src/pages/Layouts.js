import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Url } from "../config";

export default function Layouts() {
  const navigate = useNavigate();
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch layouts from backend or config
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        // Example: fetch layouts dynamically from backend
        const res = await axios.get(`${Url}/api/layouts`);
        setLayouts(res.data);
      } catch (err) {
        console.error("Failed to fetch layouts, using defaults.", err);
        // Fallback to default layouts
        setLayouts([
          { id: "layout1", name: "Simple Professional", preview: "/layout1.png" },
          { id: "layout2", name: "Modern Blue", preview: "/layout2.png" },
          { id: "layout3", name: "Minimal Clean", preview: "/layout3.png" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLayouts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading layouts...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose a CV Layout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {layouts.map((layout) => (
          <div
            key={layout.id}
            className="border shadow hover:shadow-lg cursor-pointer rounded p-3 bg-white relative"
            onClick={() => {
              if (layout.available === false) {
                alert("This layout is coming soon!");
              } else {
                navigate(`/editor/${layout.id}`);
              }
            }}
          >
            <img
              src={layout.preview}
              alt={layout.name}
              className="w-full h-64 object-cover rounded"
            />
            <h2 className="text-center font-semibold mt-3">{layout.name}</h2>

            {/* Optional: show "Coming Soon" badge */}
            {layout.available === false && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
