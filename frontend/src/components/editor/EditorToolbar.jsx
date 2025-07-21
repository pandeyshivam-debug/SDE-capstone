import { Save, Share, Edit } from "lucide-react";

function EditorToolbar({ title, setTitle, saving, onSave, onShareViewer, onShareEditor, copied, extraButton }) {
  return (
    <div className="border-b bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold bg-transparent border-none outline-none"
          placeholder="Untitled Document"
        />
        <div className="flex items-center gap-3">
          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </button>

          {/* ADD SHARE BUTTONS HERE - AFTER SAVE BUTTON */}
          {/* Share for Viewing Button */}
          <button
            onClick={onShareViewer}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            title="Share for viewing (read-only)"
          >
            <Share size={16} />
            Share View
          </button>

          {/* Share for Editing Button */}
          <button
            onClick={onShareEditor}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
            title="Share for collaborative editing"
          >
            <Edit size={16} />
            Share Edit
          </button>

          {/* Show copied feedback */}
          {copied && (
            <span className="text-sm text-green-600 font-medium">
              Link copied!
            </span>
          )}

          {extraButton}
        </div>
      </div>
    </div>
  );
}

export default EditorToolbar;
