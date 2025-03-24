
export function Card({ children }) {
  return <div className="border rounded-lg shadow-sm bg-white">{children}</div>;
}
export function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
