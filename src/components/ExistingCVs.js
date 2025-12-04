import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Layout1 from "../layouts/Layout1";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";
import { Url } from "../config";
import { AuthContext } from "../context/AuthContext";


export default function ExistingCVs({ cvs, setCVs }) {
  const navigate = useNavigate();
    const { token } = useContext(AuthContext);
  const [previewCV, setPreviewCV] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);

  const confirmDelete = async (cvId, token) => {
    try {
      await fetch(`${Url}/api/cv/${cvId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCVs((prev) => prev.filter((cv) => cv._id !== cvId));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  const handleDownloadClientPDF = async (cv) => {
    try {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "800px";
      document.body.appendChild(container);

      const root = createRoot(container);
      root.render(<Layout1 data={cv} />);
      await new Promise((res) => setTimeout(res, 500));

      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${cv.basic?.name || "my_cv"}.pdf`);
      root.unmount();
      container.remove();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF");
    }
  };

  const handleShareOnWhatsApp = (cvId) => {
    const shareUrl = `${Url}/cv/${cvId}`;
    window.open(
      `https://wa.me/?text=Check%20out%20my%20CV:%20${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
    setShareTarget(null);
  };

  const handleShareOnLinkedIn = (cvId) => {
    const shareUrl = `${Url}/cv/${cvId}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
    setShareTarget(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cvs.map((cv) => (
        <div key={cv._id} className="border p-4 rounded shadow">
          <h2 className="font-bold" style={{fontFamily: cv.design.fontFamily,fontSize: cv.design.fontSize,color: cv.design.accentColor
}}>{cv.basic?.name || "Untitled CV"}</h2>
          <p className="text-gray-600" style={{fontFamily: cv.design.fontFamily,fontSize: cv.design.fontSize,color: cv.design.primaryColor
}} >{cv.basic?.intro || ""}</p>
          <div>{console.log(cv)}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => navigate(`/editor/${cv._id}`)}
            >
              Edit
            </button>
            <button
              className="bg-gray-500 text-white px-2 py-1 rounded"
              onClick={() => setPreviewCV(cv)}
            >
              Preview
            </button>
            <button
              className="bg-purple-500 text-white px-2 py-1 rounded"
              onClick={() => handleDownloadClientPDF(cv)}
            >
              Download
            </button>
            <button
              className="bg-yellow-500 text-white px-2 py-1 rounded"
              onClick={() => setShareTarget(cv._id)}
            >
              Share
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => setDeleteTarget(cv._id)}
            >
              Delete
            </button>
          </div>

          {/* Preview Modal */}
          {previewCV && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-5 rounded shadow-lg w-3/4 max-h-[90vh] overflow-auto relative">
                <button
                  onClick={() => setPreviewCV(null)}
                  className="absolute right-1 top-1 bg-red-600 h-auto w-3 text-white"
                >
                  X
                </button>
                <Layout1 data={previewCV} />
              </div>
            </div>
          )}

          {/* Share Modal */}
          {shareTarget === cv._id && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
                <h2 className="text-xl font-bold mb-4">Share CV</h2>
                <div className="flex flex-col gap-3">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => handleShareOnWhatsApp(cv._id)}
                  >
                    Share on WhatsApp
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => handleShareOnLinkedIn(cv._id)}
                  >
                    Share on LinkedIn
                  </button>
                  <button
                    className="bg-gray-300 text-black px-4 py-2 rounded mt-2"
                    onClick={() => setShareTarget(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {deleteTarget === cv._id && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4">Delete CV?</h2>
                <p className="text-gray-600 mb-4">This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-1 bg-gray-300 rounded"
                    onClick={() => setDeleteTarget(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-1 bg-red-600 text-white rounded"
                    onClick={() => confirmDelete(cv._id, token)}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
