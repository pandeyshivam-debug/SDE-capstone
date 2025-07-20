import { BubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading,
  List,
  Quote,
  Code,
  ChevronDown
} from "lucide-react";

function EditorBubbleMenu({ editor }) {
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center bg-white border shadow-xl rounded-xl p-1 space-x-1 backdrop-blur-sm"
    >
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-3 rounded-lg hover:bg-gray-100 transition-colors ${
          editor.isActive("bold") ? "bg-blue-100 text-blue-600" : ""
        }`}
        title="Bold"
      >
        <Bold size={16} />
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-3 rounded-lg hover:bg-gray-100 transition-colors ${
          editor.isActive("italic") ? "bg-blue-100 text-blue-600" : ""
        }`}
        title="Italic"
      >
        <Italic size={16} />
      </button>

      {/* Strikethrough */}
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-3 rounded-lg hover:bg-gray-100 transition-colors ${
          editor.isActive("strike") ? "bg-blue-100 text-blue-600" : ""
        }`}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Headings Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
          className="p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-1"
          title="Heading"
        >
          <Heading size={16} />
          <ChevronDown size={12} />
        </button>
        {showHeadingDropdown && (
          <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-xl z-20 min-w-[120px]">
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level }).run();
                  setShowHeadingDropdown(false);
                }}
                className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                  editor.isActive("heading", { level }) 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : ""
                }`}
              >
                Heading {level}
              </button>
            ))}
            <div className="border-t border-gray-100"></div>
            <button
              onClick={() => {
                editor.chain().focus().setParagraph().run();
                setShowHeadingDropdown(false);
              }}
              className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
            >
              Normal Text
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-3 rounded-lg hover:bg-gray-100 transition-colors ${
          editor.isActive("bulletList") ? "bg-blue-100 text-blue-600" : ""
        }`}
        title="Bullet List"
      >
        <List size={16} />
      </button>

      {/* Blockquote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-3 rounded-lg hover:bg-gray-100 transition-colors ${
          editor.isActive("blockquote") ? "bg-blue-100 text-blue-600" : ""
        }`}
        title="Quote"
      >
        <Quote size={16} />
      </button>

      {/* Code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-3 rounded-lg hover:bg-gray-100 transition-colors ${
          editor.isActive("code") ? "bg-blue-100 text-blue-600" : ""
        }`}
        title="Inline Code"
      >
        <Code size={16} />
      </button>
    </BubbleMenu>
  );
}

export default EditorBubbleMenu;
