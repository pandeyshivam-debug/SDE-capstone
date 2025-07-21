import { Save, Share, Edit } from "lucide-react";

function EditorToolbar({ title, setTitle, saving, onSave, onShareViewer, onShareEditor, copied, extraButton }) {
  // Shared button styles
  const buttonClass =
    "px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors";

  return (
    <div className="border-b bg-gray-50 dark:bg-gray-800 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-semibold bg-transparent border-none outline-none dark:text-gray-100"
          placeholder="Untitled Document"
        />
        <div className="flex items-center gap-3">
          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={saving}
            className={`${buttonClass} disabled:opacity-50`}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </button>

          {/* Share for Viewing Button */}
          <button
            onClick={onShareViewer}
            className={buttonClass}
            title="Share for viewing (read-only)"
          >
            <Share size={16} />
            Share View
          </button>

          {/* Share for Editing Button */}
          <button
            onClick={onShareEditor}
            className={buttonClass}
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

          {/* Extra Button */}
          {extraButton && (
            <div className={buttonClass}>
              {extraButton}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditorToolbar;
