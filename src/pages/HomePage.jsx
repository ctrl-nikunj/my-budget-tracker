import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4 box-border">
      <Card className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col gap-8 p-12 box-border md:flex-row md:justify-between">
          {/* Left */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            <h1 className="text-4xl text-gray-800 m-0">🧾 Budget Tracker</h1>
            <p className="text-lg text-gray-600 leading-relaxed m-0">
              Smartly manage your finances. Ideal for solo business owners with
              unpredictable income.
            </p>
          </div>

          {/* Right */}
          <div className="flex-1 flex flex-col gap-4 justify-center items-center">
            <Button
              className="w-full max-w-xs px-4 py-3 text-base rounded-lg font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
