import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Layout1 from "../layouts/Layout1";
import { AuthContext } from "../context/AuthContext";

export default function NewUserLayouts() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [previewLayout, setPreviewLayout] = useState(null);

  // Dummy data with user basic info
  const dummyData = {
    basic: {
      name: user?.username || "John Doe",
      email: user?.email || "john@example.com",
      contact: user?.contact || "1234567890",
      intro: "A passionate developer ready to take on challenges.",
    },
    education: [
      { degree: "B.Sc. in Computer Science", institution: "XYZ University", percentage: "85%" },
    ],
    experience: [
      { organization: "ABC Corp", position: "Software Engineer", location: "New York" },
    ],
    projects: [
      { title: "Portfolio Website", technologies: "React, Tailwind", description: "A personal portfolio website." },
    ],
    skills: [
      { name: "JavaScript", percentage: 90 },
      { name: "React", percentage: 85 },
    ],
    social: [
      { platform: "LinkedIn", link: "https://linkedin.com/in/example" },
      { platform: "GitHub", link: "https://github.com/example" },
    ],
  };

  // Layout options
  const layouts = [
    {
      id: 1,
      description: "Professional Classic",
      design: { fontFamily: "Arial, sans-serif", fontSize: 20, primaryColor: "#1f6937", accentColor: "#2563eb" },
    },
    {
      id: 2,
      description: "Modern Creative",
      design: { fontFamily: "'Courier New', monospace", fontSize: 22, primaryColor: "#0d9488", accentColor: "#f43f5e" },
    },
    {
      id: 3,
      description: "Minimalistic Elegant",
      design: { fontFamily: "'Georgia', serif", fontSize: 18, primaryColor: "#374151", accentColor: "#7c3aed" },
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Choose a Layout to Start</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {layouts.map((layout) => (
          <div key={layout.id} className="border p-4 rounded shadow flex flex-col justify-between">
            {/* Mini preview */}
            <div className="mb-4">
              <h2
                style={{
                  fontFamily: layout.design.fontFamily,
                  fontSize: `${layout.design.fontSize}px`,
                  color: layout.design.primaryColor,
                }}
              >
                {dummyData.basic.name}
              </h2>
              <p style={{ color: layout.design.primaryColor }}>{dummyData.basic.email}</p>
            </div>

            <p className="text-gray-600 mb-4">{layout.description}</p>

            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setPreviewLayout(layout)}
              >
                Preview
              </button>

              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() =>
                  navigate(`/editor/new`, { state: { cvData: dummyData, layoutDesign: layout.design } })
                }
              >
                Start with this Layout
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewLayout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-5 rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto relative">
            <button
              onClick={() => setPreviewLayout(null)}
              className="absolute right-1 top-1 bg-red-600 h-auto w-3 text-white  flex items-center justify-center"
            >
              X
            </button>

            <Layout1 data={{ ...dummyData, design: previewLayout.design }} />
          </div>
        </div>
      )}
    </div>
  );
}
