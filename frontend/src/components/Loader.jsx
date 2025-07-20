export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 transition-opacity duration-500 opacity-100">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  )
}
