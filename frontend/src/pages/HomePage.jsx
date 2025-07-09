import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  BarChart3,
  Shield,
  Building2,
  FileText,
  FileSignature,
  TrendingUp,
  UserIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@/App.css";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // A small delay can sometimes help ensure CSS is fully loaded
    // before the transition starts, reducing a brief flicker.
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // 100ms delay, adjust if needed

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Container for centering content */}
      <div className="flex flex-col items-center justify-start w-full">
        {/* Header */}
        <header
          className={`relative mt-6 flex max-w-4xl items-center justify-between rounded-full bg-zinc-50/80 backdrop-blur-sm px-6 py-4 shadow-lg transition-opacity duration-1000 w-full ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex w-full items-center justify-between">
            {/* Logo + Name */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-semibold text-zinc-700">
                Paylert
              </span>
            </div>

            {/* Login Button */}
            <Button
              onClick={() => navigate("/login")}
              className="rounded-full bg-zinc-700 text-white hover:bg-zinc-900 transition-colors"
            >
              <UserIcon />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-16 w-full">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-4 opacity-0 scale-95"
            }`}
          >
            {/* Hero */}
            <section className="text-center mb-20">
              <h1 className="text-5xl font-bold text-zinc-700 mb-6">
                Bookkeeping. GST. Compliance.
              </h1>
              <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-8">
                A Tally-inspired business ledger for modern professionals. Track
                income, generate e-invoices, e-way bills, and stay compliant.
              </p>
              <Button
                onClick={() => navigate("/register")}
                className="bg-zinc-800 hover:bg-zinc-900 text-white px-6 py-3 text-lg"
              >
                Start Free
              </Button>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: <Building2 className="w-6 h-6 text-zinc-700" />,
                  title: "Multi-Company Support",
                  desc: "Manage ledgers, vouchers, and reports across different businesses.",
                },
                {
                  icon: <FileSignature className="w-6 h-6 text-zinc-700" />,
                  title: "E-Invoice Ready",
                  desc: "IRN, QR Code and NIC-compliant PDFs integrated seamlessly.",
                },
                {
                  icon: <Shield className="w-6 h-6 text-zinc-700" />,
                  title: "Bank-grade Security",
                  desc: "Your company financials are stored and encrypted securely.",
                },
                {
                  icon: <FileText className="w-6 h-6 text-zinc-700" />,
                  title: "Tally-Like Ledger",
                  desc: "Double-entry accounting with trial balance, P&L, and more.",
                },
                {
                  icon: <TrendingUp className="w-6 h-6 text-zinc-700" />,
                  title: "Business Insights",
                  desc: "Track your income, cashflow, and liabilities visually.",
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-zinc-700" />,
                  title: "Analytics Dashboard",
                  desc: "Monthly summaries, trends, and category breakdowns.",
                },
              ].map((f, idx) => (
                <Card
                  key={idx}
                  className="hover:border-zinc-600/25 hover:scale-[1.03] transition-transform duration-300"
                >
                  <CardContent className="my-6 px-4 text-center">
                    <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                      {f.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-800 mb-2">
                      {f.title}
                    </h3>
                    <p className="text-zinc-600 text-sm">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </section>

            {/* Simulated Dashboard Preview */}
            <section className="bg-white rounded-xl border border-zinc-200 p-8 mb-20">
              <h2 className="text-2xl font-semibold text-zinc-800 mb-6 text-center">
                Simplified Tally-like Dashboard
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-center mb-6">
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6">
                  <div className="text-xl font-bold text-zinc-800 mb-1">
                    ₹5,25,000
                  </div>
                  <div className="text-sm text-zinc-500">Monthly Sales</div>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6">
                  <div className="text-xl font-bold text-zinc-800 mb-1">
                    ₹2,90,000
                  </div>
                  <div className="text-sm text-zinc-500">Monthly Expenses</div>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6">
                  <div className="text-xl font-bold text-zinc-800 mb-1">
                    ₹2,35,000
                  </div>
                  <div className="text-sm text-zinc-500">Net Profit</div>
                </div>
              </div>

              <div className="mt-6 bg-zinc-50 rounded-lg p-4 border border-zinc-200">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-zinc-700">
                    Recent Entries
                  </span>
                  <span className="text-xs text-zinc-500">Last 7 Days</span>
                </div>
                <div className="space-y-3 text-sm text-zinc-700">
                  <div className="flex justify-between">
                    <span>Sale - ABC Electronics</span>
                    <span className="font-medium text-green-600">+₹20,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Purchase - Raw Material</span>
                    <span className="font-medium text-red-600">-₹8,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transportation E-Way</span>
                    <span className="font-medium text-red-600">-₹2,100</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-zinc-700 mb-4">
                Run Your Business Smoothly
              </h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto mb-8">
                From invoice creation to GST filing, Paylert Books gives you
                everything you need to stay compliant and in control.
              </p>
              <Button
                onClick={() => navigate("/register")}
                className="bg-zinc-700 hover:bg-zinc-900 text-white text-md px-8 py-3"
              >
                Try for Free
              </Button>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-300 bg-white w-full">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center text-zinc-500 text-sm">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <DollarSign className="w-4 h-4 text-zinc-600" />
              <span>Paylert Books © 2025</span>
            </div>
            <div>Made for Indian businesses & startups</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
