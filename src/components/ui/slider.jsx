
export function Slider({ value, onValueChange, min = 0, max = 100, step = 1 }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      className="w-full"
    />
  );
}
