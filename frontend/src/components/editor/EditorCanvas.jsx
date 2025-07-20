import { EditorContent } from "@tiptap/react";
import EditorBubbleMenu from "./EditorBubbleMenu";

function EditorCanvas({ editor }) {
  return (
    <div className="flex justify-center flex-1 overflow-y-auto p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8 relative min-h-[calc(100vh-180px)]">
        <EditorBubbleMenu editor={editor} />
        
        <EditorContent
          editor={editor}
          className="min-h-[calc(100vh-250px)] focus:outline-none prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-900"
        />
        
        <div className="absolute bottom-6 right-6 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
          Type "/" for commands
        </div>
      </div>
    </div>
  );
}

export default EditorCanvas;
