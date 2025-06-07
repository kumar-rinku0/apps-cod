const ExportUsersCSVButton = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch("/api/export/users/csv");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "user_data_export.csv";
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("CSV download failed:", err);
      alert("Failed to download CSV. Please try again.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
    >
      Export Users CSV
    </button>
  );
};

export default ExportUsersCSVButton;