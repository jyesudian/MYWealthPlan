export default function ProgressBar({ progress, color = "bg-primary" }) {
  // Ensure progress is bounded between 0 and 100
  const widthVal = Math.min(Math.max(0, progress), 100)

  return (
    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
      <div
        className={`${color} h-2.5 rounded-full transition-all duration-1000`}
        style={{ width: `${widthVal}%` }}
      ></div>
    </div>
  )
}
