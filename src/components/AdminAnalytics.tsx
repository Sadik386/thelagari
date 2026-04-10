import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const AdminAnalytics = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("auth-token"); // Assuming token storage
      const response = await fetch(`${apiUrl}/admin/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch statistics");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) return <div className="text-center py-20">Loading analytics...</div>;

  const statCards = [
    { title: "Total Revenue", value: `€${(stats.totals?.revenue || 0).toFixed(2)}`, icon: DollarSign, description: "All-time revenue", trend: "+12.5%", isUp: true },
    { title: "Orders", value: stats.totals?.orders || 0, icon: ShoppingBag, description: "Total orders placed", trend: "+5.2%", isUp: true },
    { title: "Customers", value: stats.totals?.users || 0, icon: Users, description: "Registered customers", trend: "+18.1%", isUp: true },
    { title: "Products", value: stats.totals?.products || 0, icon: Package, description: "Active catalog items", trend: "0%", isUp: true },
  ];

  const chartData = (stats.ordersByStatus || []).map((item: any) => ({
    name: item._id?.charAt(0).toUpperCase() + item._id?.slice(1),
    value: item.count || 0
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F"];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.isUp ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                )}
                <span className={`text-xs font-medium ${stat.isUp ? "text-emerald-500" : "text-rose-500"}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Breakdown of order fulfillment states.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ backgroundColor: "#1c1c1c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Sales Activity</CardTitle>
            <CardDescription>Income generated in the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px]">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold tracking-tighter text-emerald-500">€{(stats.totals?.recentRevenue || 0).toFixed(2)}</div>
              <p className="text-muted-foreground">Monthly Recurring Revenue (MRR)</p>
              <div className="inline-flex items-center px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-xs">
                Performance: Above Average
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
