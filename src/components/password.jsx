// components/PasswordStrengthBar.jsx
import zxcvbn from "zxcvbn";

export default function PasswordStrengthBar({ password }) {
  const result = zxcvbn(password);
  const strength = result.score; // 0 to 4
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-400",
    "bg-green-600",
  ];
  const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  if (password) {
    return (
      <div className="mt-2">
        <div className="h-2 w-full bg-gray-300 rounded">
          <div
            className={`h-2 rounded transition-all duration-300 ${colors[strength]}`}
            style={{ width: `${(strength + 1) * 20}%` }}
          />
        </div>
        {password && (
          <p className="text-sm mt-1 text-slate-300 italic">
            Strength: {strengthText[strength]}
          </p>
        )}
      </div>
    );
  } else {
    return "";
  }
}
