import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProductList from "@/components/AdminProductList";
import AdminProductForm from "@/components/AdminProductForm";
import AdminOrders from "@/components/AdminOrders";
import AdminCustomers from "@/components/AdminCustomers";
import AdminAnalytics from "@/components/AdminAnalytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard, Package, Tag, ShoppingBag, Users, BarChart3, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("analytics");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  const adminEmails = ["mdsiam386siam@gmail.com", "test@example.com"];
  const isAdmin = user && adminEmails.map(e => e.toLowerCase()).includes(user?.email?.toLowerCase() || "");

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-6 bg-destructive/10 rounded-full">
          <Lock className="w-12 h-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            You do not have permission to access the admin dashboard. 
            Please sign in with an authorized account.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/")}>Back to Store</Button>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
      </div>
    );
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsAdding(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsAdding(true);
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary rounded-xl">
            <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store products, orders, and data.</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate("/")} className="gap-2 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Button>
      </div>

      {isAdding ? (
        <AdminProductForm 
          product={editingProduct} 
          onCancel={() => setIsAdding(false)} 
          onSuccess={() => setIsAdding(false)} 
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:max-w-2xl glass">
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" /> Stats
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" /> Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="w-4 h-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="gap-2">
              <Users className="w-4 h-4" /> Customers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Products Management</CardTitle>
                <CardDescription>View, edit, and add new products to your catalog.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminProductList 
                  onEdit={handleEditProduct} 
                  onAdd={handleAddProduct} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
                <CardDescription>Track and update order fulfillment status.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminOrders />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Customer Directory</CardTitle>
                <CardDescription>View customer registration data and shopping history.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCustomers />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Admin;
