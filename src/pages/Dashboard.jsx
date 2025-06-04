import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-3xl border shadow-lg">
        <CardContent className="p-10 text-center text-xl font-semibold text-gray-700">
          📊 Dashboard – Coming Soon!
        </CardContent>
      </Card>
    </div>
  );
}
