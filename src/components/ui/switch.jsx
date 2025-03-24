
export function Switch({ checked, onCheckedChange }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="accent-blue-500 w-4 h-4"
    />
  );
}
