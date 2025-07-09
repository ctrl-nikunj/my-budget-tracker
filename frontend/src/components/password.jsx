// src/components/PasswordStrengthBar.jsx
export default function PasswordStrengthBar({ password }) {
  const getStrengthInfo = (pwd) => {
    if (!pwd) return { level: 0, text: "", color: "" };

    if (pwd.length < 6) {
      return { level: 1, text: "Very Weak", color: "bg-red-500" };
    }

    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSymbol = /[\W_]/.test(pwd);
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const score = [hasLower, hasUpper, hasNumber, hasSymbol].filter(
      Boolean
    ).length;

    if (strongPasswordRegex.test(pwd)) {
      return { level: 5, text: "Strong", color: "bg-green-600" };
    } else if (score === 4) {
      return { level: 4, text: "Good", color: "bg-green-400" };
    } else if (score === 3) {
      return { level: 3, text: "Fair", color: "bg-yellow-500" };
    } else if (score === 2) {
      return { level: 2, text: "Weak", color: "bg-orange-500" };
    } else {
      return { level: 1, text: "Very Weak", color: "bg-red-500" };
    }
  };

  const { level, text, color } = getStrengthInfo(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-300 rounded">
        <div
          className={`h-2 rounded transition-all duration-300 ${color}`}
          style={{ width: `${(level / 5) * 100}%` }}
        />
      </div>
      <p className="text-sm mt-1 text-zinc-500 italic">Strength: {text}</p>
    </div>
  );
}
