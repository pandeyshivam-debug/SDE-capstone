export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 transition-opacity duration-500 opacity-100">
      <div className="w-16 h-16 border-4 border-gray-300/40 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-200">{text}</p>
    </div>
  )
}
