export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 ${className}`}>
      {children}
    </div>
  )
}
