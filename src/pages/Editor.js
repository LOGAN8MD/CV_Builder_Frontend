import { useState, useEffect, useContext,useCallback } from "react";
import Layout1 from "../layouts/Layout1";
import axios from "axios";
import { Url } from "../config";
import { AuthContext } from "../context/AuthContext";
import { useNavigate,  useLocation } from "react-router-dom";

const STEP_TITLES = [
  "Basic",
  "Education",
  "Experience",
  "Projects",
  "Skills",
  "Social",
  "Design",
];

export default function Editor() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const location = useLocation();
  

  const { cvData, layoutDesign } = location.state || {}; // from NewUserLayouts

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const [cv, setCV] = useState({
    basic: { name: "", email: "", contact: "", intro: "" },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    social: [],
    design: {
      fontFamily: "Arial",
      fontSize: 14,
      primaryColor: "#000000",
      accentColor: "#4F46E5",
    },
  });

  // Initialize CV if coming from NewUserLayouts
  
  useEffect(() => {
    if (cvData) {
      setCV({
        ...cvData,
        design: layoutDesign || cv.design,
      });
    }
  }, [cvData, layoutDesign,cv.design]);



const addItem = useCallback((field) => {
  setCV((prevCV) => ({
    ...prevCV,
    [field]: [...prevCV[field], {}],
  }));
}, []);

  useEffect(() => {
    switch (step) {
      case 1:
        if (cv.education.length === 0) addItem("education");
        break;
      case 2:
        if (cv.experience.length === 0) addItem("experience");
        break;
      case 3:
        if (cv.projects.length === 0) addItem("projects");
        break;
      case 4:
        if (cv.skills.length === 0) addItem("skills");
        break;
      case 5:
        if (cv.social.length === 0) addItem("social");
        break;
      default:
        break;
    }
  }, [step,
    addItem,
  cv.education.length,
  cv.experience.length,
  cv.projects.length,
  cv.skills.length,
  cv.social.length]);

  // Validation
  const validateStep = () => {
    setError("");
    switch (step) {
      case 0: {
        const { name, email } = cv.basic;
        if (!name || !email) {
          setError("Name and Email are required.");
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Invalid email format.");
          return false;
        }
        break;
      }
      case 1:
        for (let edu of cv.education) {
          if (!edu.degree || !edu.institution || !edu.percentage) {
            setError("All Education fields are required.");
            return false;
          }
        }
        break;
      case 2:
        for (let exp of cv.experience) {
          if (!exp.organization || !exp.position) {
            setError("All Experience fields are required.");
            return false;
          }
        }
        break;
      case 3:
        for (let proj of cv.projects) {
          if (!proj.title || !proj.description) {
            setError("All Project fields are required.");
            return false;
          }
        }
        break;
      case 4:
        for (let skill of cv.skills) {
          if (!skill.name || skill.percentage < 0 || skill.percentage > 100) {
            setError("Each skill must have a name and valid percentage.");
            return false;
          }
        }
        break;
      case 5:
        for (let soc of cv.social) {
          if (soc.link && !/^https?:\/\/\S+$/.test(soc.link)) {
            setError("Invalid URL format for social link.");
            return false;
          }
        }
        break;
        
      default: return true;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, STEP_TITLES.length - 1));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const saveCV = async () => {
    console.log("Saving CV:", cv);
    if (!validateStep()) return;
    
    try {
      await axios.post(`${Url}/api/cv`, cv, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      alert("CV Saved Successfully!");
      navigate("/");
    } catch (err) {
      console.log("Error saving CV:", err);
      setError(err.response?.data?.msg || "Failed to save CV");
    }
  };

  
  const removeItem = (field, index) => {
    const updated = [...cv[field]];
    updated.splice(index, 1);
    setCV({ ...cv, [field]: updated });
  };
  const updateItem = (field, index, key, value) => {
    const updated = [...cv[field]];
    updated[index][key] = value;
    setCV({ ...cv, [field]: updated });
  };

  // Dynamic fields renderer
  const renderDynamicFields = () => {
    switch (step) {
      case 1:
        return cv.education.map((edu, i) => (
          <div key={i} className="border p-5 mb-2 rounded relative">
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
              onChange={(e) => updateItem("education", i, "institution", e.target.value)}
            />
            <input
              type="number"
              className="border p-1 w-full mb-1"
              placeholder="Percentage / Grade"
              value={edu.percentage || ""}
              onChange={(e) => updateItem("education", i, "percentage", e.target.value)}
            />
            <button
              className="absolute top-0 right-0 bg-red-600 h-auto w-3 m-1 text-white cursor-pointer"
              onClick={() => removeItem("education", i)}
            >
              X
            </button>
          </div>
        ));

      case 2:
        return cv.experience.map((exp, i) => (
          <div key={i} className="border p-5 mb-2 rounded relative">
            <input
              className="border p-1 w-full mb-1"
              placeholder="Organization"
              value={exp.organization || ""}
              onChange={(e) => updateItem("experience", i, "organization", e.target.value)}
            />
            <input
              className="border p-1 w-full mb-1"
              placeholder="Position"
              value={exp.position || ""}
              onChange={(e) => updateItem("experience", i, "position", e.target.value)}
            />
            <input
              className="border p-1 w-full mb-1"
              placeholder="Location"
              value={exp.location || ""}
              onChange={(e) => updateItem("experience", i, "location", e.target.value)}
            />
            <button
              className="absolute top-0 right-0 bg-red-600 h-auto w-3 m-1 text-white cursor-pointer"
              onClick={() => removeItem("experience", i)}
            >
              X
            </button>
          </div>
        ));

      case 3:
        return cv.projects.map((proj, i) => (
          <div key={i} className="border p-5 mb-2 rounded relative">
            <input
              className="border p-1 w-full mb-1"
              placeholder="Project Title"
              value={proj.title || ""}
              onChange={(e) => updateItem("projects", i, "title", e.target.value)}
            />
            <input
              className="border p-1 w-full mb-1"
              placeholder="Technologies"
              value={proj.technologies || ""}
              onChange={(e) => updateItem("projects", i, "technologies", e.target.value)}
            />
            <textarea
              className="border p-1 w-full mb-1"
              placeholder="Description"
              value={proj.description || ""}
              onChange={(e) => updateItem("projects", i, "description", e.target.value)}
            />
            <button
              className="absolute top-0 right-0 bg-red-600 h-auto w-3 m-1 text-white cursor-pointer"
              onClick={() => removeItem("projects", i)}
            >
              X
            </button>
          </div>
        ));

      case 4:
        return cv.skills.map((skill, i) => (
          <div key={i} className="border p-5 mb-2 rounded relative">
            <input
              className="border p-1 w-full mb-1"
              placeholder="Skill Name"
              value={skill.name || ""}
              onChange={(e) => updateItem("skills", i, "name", e.target.value)}
            />
            <input
              className="border p-1 w-full mb-1"
              type="number"
              min={0}
              max={100}
              placeholder="Percentage"
              value={skill.percentage || ""}
              onChange={(e) => updateItem("skills", i, "percentage", Number(e.target.value))}
            />
            <button
              className="absolute top-0 right-0 bg-red-600 h-auto w-3 m-1 text-white cursor-pointer"
              onClick={() => removeItem("skills", i)}
            >
              X
            </button>
          </div>
        ));

      case 5:
        return cv.social.map((soc, i) => (
          <div key={i} className="border p-5 mb-2 rounded relative">
            <input
              className="border p-1 w-full mb-1"
              placeholder="Platform Name"
              value={soc.platform || ""}
              onChange={(e) => updateItem("social", i, "platform", e.target.value)}
            />
            <input
              className="border p-1 w-full mb-1"
              placeholder="Profile URL"
              value={soc.link || ""}
              onChange={(e) => updateItem("social", i, "link", e.target.value)}
            />
            <button
              className="absolute top-0 right-0 bg-red-600 h-auto w-3 m-1 text-white cursor-pointer"
              onClick={() => removeItem("social", i)}
            >
              X
            </button>
          </div>
        ));

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-2 h-screen gap-2">
      {/* Form Area */}
      <div className="p-4 overflow-y-auto border-r space-y-4">
        {error && <p className="bg-red-200 p-2 text-red-700 rounded">{error}</p>}
        <h2 className="text-xl font-bold">{STEP_TITLES[step]}</h2>

        {/* BASIC */}
        {step === 0 && (
          <>
            <input
              className="border p-2 w-full mb-2"
              placeholder="Full Name*"
              value={cv.basic.name}
              onChange={(e) => setCV({ ...cv, basic: { ...cv.basic, name: e.target.value } })}
            />

            <input
              type="email"
              className="border p-2 w-full mb-2"
              placeholder="Email*"
              value={cv.basic.email}
              onChange={(e) => setCV({ ...cv, basic: { ...cv.basic, email: e.target.value } })}
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Contact Number"
              value={cv.basic.contact}
              onChange={(e) => setCV({ ...cv, basic: { ...cv.basic, contact: e.target.value } })}
            />

            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Short Introduction"
              value={cv.basic.intro}
              onChange={(e) => setCV({ ...cv, basic: { ...cv.basic, intro: e.target.value } })}
            />
          </>
        )}

        {/* ARRAY STEPS */}
        {[1, 2, 3, 4, 5].includes(step) && (
          <>
            {renderDynamicFields()}

            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => addItem(["education", "experience", "projects", "skills", "social"][step - 1])}
            >
              + Add
            </button>
          </>
        )}

        {/* DESIGN STEP */}
        {step === 6 && (
          <>
            <label className="font-semibold">Font Family</label>
            <select
              className="border p-2 w-full mb-3"
              value={cv.design.fontFamily}
              onChange={(e) => setCV({ ...cv, design: { ...cv.design, fontFamily: e.target.value } })}
            >
              <option value="Arial">Arial</option>
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
               <option value="'Courier New', monospace">'Courier New', monospace</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>

            <label className="font-semibold">Font Size</label>
            <input
              type="number"
              min={10}
              max={30}
              className="border p-2 w-full mb-3"
              value={cv.design.fontSize}
              onChange={(e) => setCV({ ...cv, design: { ...cv.design, fontSize: Number(e.target.value) } })}
            />

            <div className="flex justify-between space-x-3">
              <div>
                <label className="font-semibold">Title Color</label>
                <input
                  type="color"
                  className="border p-1 w-20 mb-3"
                  value={cv.design.accentColor}
                  onChange={(e) => setCV({ ...cv, design: { ...cv.design, accentColor: e.target.value } })}
                />
              </div>
              <div>
                <label className="font-semibold">Primary Text Color</label>
                <input
                  type="color"
                  className="border p-1 w-20 mb-3"
                  value={cv.design.primaryColor}
                  onChange={(e) => setCV({ ...cv, design: { ...cv.design, primaryColor: e.target.value } })}
                />
              </div>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          {step > 0 && (
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={prevStep}>
              Previous
            </button>
          )}

          {step < STEP_TITLES.length - 1 && (
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={nextStep}>
              Next
            </button>
          )}

          {step === STEP_TITLES.length - 1 && (
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={saveCV}>
              Save CV
            </button>
          )}
        </div>
      </div>

      {/* PREVIEW */}
      <div  className="p-4 bg-gray-100 overflow-y-auto border rounded">
        <Layout1 data={cv} />
      </div>
    </div>
  );
}
