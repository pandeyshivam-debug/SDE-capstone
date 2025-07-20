import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

export function useEditorOperations(id) {
  const [title, setTitle] = useState("Untitled");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchFile = useCallback(async (editor) => {
    if (!editor) return;
    
    try {
      const res = await axios.get(`/files/${id}`);
      setTitle(res.data.title || "Untitled");
      
      if (res.data.content) {
        editor.commands.setContent(res.data.content);
      }
    } catch (err) {
      console.error("Error loading file:", err);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const saveFile = useCallback(async (editor) => {
    if (!editor || saving) return;
    
    setSaving(true);
    try {
      const contentJSON = editor.getJSON();
      await axios.put(`/files/${id}`, {
        title: title || "Untitled",
        content: contentJSON,
      });
      
      // Show success state briefly
      setTimeout(() => setSaving(false), 1000);
    } catch (err) {
      console.error("Error saving file:", err);
      alert("Failed to save document.");
      setSaving(false);
    }
  }, [id, title, saving]);

  return {
    title,
    setTitle,
    loading,
    saving,
    fetchFile,
    saveFile
  };
}
