export default function Layout1({ data }) {
  const { basic, education, experience, projects, skills, social, design } = data;

  // Use design settings
  const font = design?.fontFamily || "Arial";
  const fontSize = design?.fontSize ? `${design.fontSize}px` : "16px";
  const textColor = design?.primaryColor || "#1a1a1a";
  const headingColor = design?.accentColor || "#1e40af";
  const accentColor = design?.accentColor || "#2563eb";

  return (
    <div
      className="p-6 border bg-white shadow rounded space-y-6"
      style={{
        fontFamily: font,
        fontSize: fontSize,
        color: textColor,
      }}
    >
      {console.log("######################",font)}
      {/* Basic Info */}
      <div>
        <h1
          className="font-bold"
          style={{ fontSize: "32px", color: headingColor }}
        >
          {basic.name || "Your Name"}
        </h1>

        {basic.email && <p>Email: {basic.email}</p>}
        {basic.contact && <p>Contact: {basic.contact}</p>}
        {basic.intro && (
          <p className="mt-2" style={{ opacity: 0.8 }}>
            {basic.intro}
          </p>
        )}
      </div>

      {/* Education */}
      {education.length > 0 && (
        <div>
          <h2
            className="font-semibold border-b pb-1 mb-2"
            style={{ fontSize: "20px", color: headingColor }}
          >
            Education
          </h2>

          <ul className="list-disc list-inside space-y-1">
            {education.map((edu, i) => (
              <li key={i}>
                <span className="font-semibold">{edu.degree}</span> at {edu.institution}{" "}
                {edu.percentage && `- ${edu.percentage}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div>
          <h2
            className="font-semibold border-b pb-1 mb-2"
            style={{ fontSize: "20px", color: headingColor }}
          >
            Experience
          </h2>

          <ul className="list-disc list-inside space-y-1">
            {experience.map((exp, i) => (
              <li key={i}>
                <span className="font-semibold">{exp.position}</span> at {exp.organization}{" "}
                {exp.location && `- ${exp.location}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <h2
            className="font-semibold border-b pb-1 mb-2"
            style={{ fontSize: "20px", color: headingColor }}
          >
            Projects
          </h2>

          <ul className="list-disc list-inside space-y-1">
            {projects.map((proj, i) => (
              <li key={i}>
                <span className="font-semibold">{proj.title}</span>{" "}
                {proj.technologies && (
                  <span style={{ opacity: 0.7 }}>({proj.technologies})</span>
                )}
                {proj.description && (
                  <p style={{ opacity: 0.8 }}>{proj.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2
            className="font-semibold border-b pb-1 mb-2"
            style={{ fontSize: "20px", color: headingColor }}
          >
            Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <div
                key={i}
                style={{
                  background: accentColor + "20",
                  border: `1px solid ${accentColor}`,
                  color: accentColor,
                }}
                className="px-2 py-1 rounded"
              >
                {skill.name} {skill.percentage ? `(${skill.percentage}%)` : ""}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social */}
      {social.length > 0 && (
        <div>
          <h2
            className="font-semibold border-b pb-1 mb-2"
            style={{ fontSize: "20px", color: headingColor }}
          >
            Social Profiles
          </h2>

          <ul className="list-disc list-inside space-y-1">
            {social.map((s, i) => (
              <li key={i}>
                {s.platform && <span className="font-semibold">{s.platform}: </span>}
                {s.link && (
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: accentColor }}
                    className="underline"
                  >
                    {s.link}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
