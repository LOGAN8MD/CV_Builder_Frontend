import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Url } from "../config";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Layout1 from "../layouts/Layout1";

const TABS = [
  "Basic",
  "Education",
  "Experience",
  "Projects",
  "Skills",
  "Social",
  "Design",
];

export default function EditEditor() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  

  const [cv, setCV] = useState(null);

  // Load existing CV
  useEffect(() => {
    const fetchCV = async () => {
      try {
        const res = await axios.get(`${Url}/api/cv/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCV(res.data);
        console.log(res.data)
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load CV");
        setLoading(false);
      }
    };
    fetchCV();
  }, [id, token]);

  // PDF Download
  const printPDF = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${cv?.basic?.name || "Resume"}.pdf`,
  });

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (!cv) return <p className="p-4 text-red-500">CV Not Found</p>;

  // =============================
  // Helper Functions
  // =============================
  const updateField = (section, key, value) => {
    setCV({ ...cv, [section]: { ...cv[section], [key]: value } });
  };

  const updateItem = (section, i, key, value) => {
    const updated = [...cv[section]];
    updated[i][key] = value;
    setCV({ ...cv, [section]: updated });
  };

  const addItem = (section) => {
    setCV({ ...cv, [section]: [...cv[section], {}] });
  };

  const removeItem = (section, index) => {
    const updated = [...cv[section]];
    updated.splice(index, 1);
    setCV({ ...cv, [section]: updated });
  };

  const saveCV = async () => {
    try {
      await axios.put(`${Url}/api/cv/${id}`, cv, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("CV Updated Successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to update CV");
    }
  };

  // =============================
  // Dynamic Form Tabs
  // =============================
  const renderTabContent = () => {
    switch (tab) {
      case 0: // BASIC
        return (
          <>
            <input
              className="border p-2 w-full mb-2"
              placeholder="Full Name"
              value={cv.basic.name || ""}
              onChange={(e) => updateField("basic", "name", e.target.value)}
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Email"
              value={cv.basic.email || ""}
              onChange={(e) => updateField("basic", "email", e.target.value)}
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Contact Number"
              value={cv.basic.contact || ""}
              onChange={(e) => updateField("basic", "contact", e.target.value)}
            />

            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Short Intro"
              value={cv.basic.intro || ""}
              onChange={(e) => updateField("basic", "intro", e.target.value)}
            />
          </>
        );

      case 1: // EDUCATION
        return cv.education.map((edu, i) => (
          <div key={i} className="border p-6 rounded mb-3 relative">
            <input
              className="border p-1 w-full mb-1"
              placeholder="Degree"
              value={edu.degree || ""}
              onChange={(e) => updateItem("education", i, "degree", e.target.value)}
            />
            <input
              className="border p-1 w-full mb-1"
              placeholder="Institution"
              value={edu.institution || ""}
              onChange={(e) =>
                updateItem("education", i, "institution", e.target.value)
              }
            />
            <input
              type="number"
              className="border p-1 w-full"
              placeholder="Percentage"
              value={edu.percentage || ""}
              onChange={(e) =>
                updateItem("education", i, "percentage", e.target.value)
              }
            />

            <button
              className="absolute top-1 right-1 bg-red-600 h-auto w-3   text-white "
              onClick={() => removeItem("education", i)}
            >
              X
            </button>
          </div>
        ));

      case 2: // EXPERIENCE
        return cv.experience.map((exp, i) => (
          <div key={i} className="border p-6 rounded mb-3 relative">
            <input
              className="border p-1 w-full mb-1"
              placeholder="Organization"
              value={exp.organization || ""}
              onChange={(e) =>
                updateItem("experience", i, "organization", e.target.value)
              }
            />
            <input
              className="border p-1 w-full mb-1"
              placeholder="Position"
              value={exp.position || ""}
              onChange={(e) =>
                updateItem("experience", i, "position", e.target.value)
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="Location"
              value={exp.location || ""}
              onChange={(e) =>
                updateItem("experience", i, "location", e.target.value)
              }
            />

            <button
              className="absolute top-1 right-1 bg-red-600 h-auto w-3   text-white"
              onClick={() => removeItem("experience", i)}
            >
              X
            </button>
          </div>
        ));

      case 3: // PROJECTS
        return cv.projects.map((proj, i) => (
          <div key={i} className="border p-6 rounded mb-3 relative">
            <input
              className="border p-1 w-full mb-1"
              placeholder="Project Name"
              value={proj.title || ""}
              onChange={(e) =>
                updateItem("projects", i, "title", e.target.value)
              }
            />
            <input
              className="border p-1 w-full mb-1"
              placeholder="Technologies"
              value={proj.technologies || ""}
              onChange={(e) =>
                updateItem("projects", i, "technologies", e.target.value)
              }
            />
            <textarea
              className="border p-1 w-full"
              placeholder="Description"
              value={proj.description || ""}
              onChange={(e) =>
                updateItem("projects", i, "description", e.target.value)
              }
            />

            <button
              className="absolute top-1 right-1 bg-red-600 h-auto w-3   text-white"
              onClick={() => removeItem("projects", i)}
            >
              X
            </button>
          </div>
        ));

      case 4: // SKILLS
        return cv.skills.map((skill, i) => (
          <div key={i} className="border p-6 rounded mb-3 relative">
            <input
              className="border p-1 w-full mb-1"
              placeholder="Skill Name"
              value={skill.name || ""}
              onChange={(e) =>
                updateItem("skills", i, "name", e.target.value)
              }
            />
            <input
              type="number"
              min={0}
              max={100}
              className="border p-1 w-full"
              placeholder="Percentage"
              value={skill.percentage || ""}
              onChange={(e) =>
                updateItem("skills", i, "percentage", Number(e.target.value))
              }
            />

            <button
              className="absolute top-1 right-1 bg-red-600 h-auto w-3   text-white"
              onClick={() => removeItem("skills", i)}
            >
              X
            </button>
          </div>
        ));

      case 5: // SOCIAL
        return cv.social.map((soc, i) => (
          <div key={i} className="border p-6 rounded mb-3 relative">
            <input
              className="border p-1 w-full mb-1"
              placeholder="Platform"
              value={soc.platform || ""}
              onChange={(e) =>
                updateItem("social", i, "platform", e.target.value)
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="Profile URL"
              value={soc.link || ""}
              onChange={(e) => updateItem("social", i, "link", e.target.value)}
            />
            <button
              className="absolute top-1 right-1 bg-red-600 h-auto w-3   text-white"
              onClick={() => removeItem("social", i)}
            >
              X
            </button>
          </div>
        ));

      case 6: // DESIGN
        return (
          <>
            <label className="font-semibold">Font Family</label>
            <select
              className="border p-2 w-full mb-3"
              value={cv.design?.fontFamily || ""}
              onChange={(e) =>
                updateField("design", "fontFamily", e.target.value)
              }
            >
              <option value="Arial">Arial</option>
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>

            <label className="font-semibold">Font Size</label>
            <input
              type="number"
              className="border p-2 w-full mb-3"
              value={cv.design?.fontSize || 16}
              onChange={(e) =>
                updateField("design", "fontSize", Number(e.target.value))
              }
            />

            <label className="font-semibold block">Title Color</label>
            <input
              type="color"
              className="border p-2 w-20 mb-3"
              value={cv.design?.accentColor || "#000000"}
              onChange={(e) =>
                updateField("design", "accentColor", e.target.value)
              }
            />

            <label className="font-semibold block">Text Color</label>
            <input
              type="color"
              className="border p-2 w-20"
              value={cv.design?.primaryColor || "#000000"}
              onChange={(e) =>
                updateField("design", "primaryColor", e.target.value)
              }
            />
          </>
        );

      default: return null;
    }
  };

  // =============================
  // UI Layout (Vertical Tabs)
  // =============================
  return (
    <div className="grid grid-cols-12 h-screen">
      {/* LEFT SIDE TABS */}
      <div className="col-span-3 border-r p-4 bg-gray-100">
        {TABS.map((t, i) => (
          <div
            key={i}
            className={`p-3 mb-2 rounded cursor-pointer ${
              tab === i ? "bg-blue-600 text-white" : "bg-white"
            }`}
            onClick={() => setTab(i)}
          >
            {t}
          </div>
        ))}

        {/* SAVE & DOWNLOAD BUTTONS */}
        <div className="mt-6 space-y-3">
          <button
            className="w-full bg-green-600 text-white p-2 rounded"
            onClick={saveCV}
          >
            Save Changes
          </button>

          <button
            className="w-full bg-purple-600 text-white p-2 rounded"
            onClick={printPDF}
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* MIDDLE CONTENT FORM */}
      <div className="col-span-4 p-4 overflow-y-auto">
        {renderTabContent()}

        {[1, 2, 3, 4, 5].includes(tab) && (
          <button
            onClick={() =>
              addItem(["education", "experience", "projects", "skills", "social"][tab - 1])
            }
            className="bg-green-500 text-white px-3 py-1 rounded mt-3"
          >
            + Add
          </button>
        )}
      </div>

      {/* RIGHT SIDE PREVIEW */}
      <div className="col-span-5 p-4 overflow-y-auto bg-gray-50" ref={printRef}>
        <Layout1 data={cv} />
      </div>
    </div>
  );
}
