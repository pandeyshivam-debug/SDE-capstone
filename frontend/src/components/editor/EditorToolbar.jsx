import { Save } from "lucide-react";

function EditorToolbar({ title, setTitle, saving, onSave, extraButton }) {
  return (
    <div className="flex items-center justify-between p-4 shadow bg-white border-b">
      <div className="flex items-center space-x-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80 border border-gray-200"
          placeholder="Document Title"
        />
        {saving && (
          <span className="text-sm text-gray-500 animate-pulse flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping mr-2"></div>
            Saving...
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {/* Optional Extra Button (like Share) */}
        {extraButton && extraButton}

        {/* Save Button */}
        <button
          onClick={onSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}

export default EditorToolbar;
