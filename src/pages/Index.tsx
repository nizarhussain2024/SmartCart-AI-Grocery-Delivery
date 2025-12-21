import React, { useState, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, Search, Plus, Minus, Trash2, Sparkles, 
  Clock, MapPin, Brain, TrendingUp, Package
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  aiRecommended?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: "Organic Bananas", price: 2.99, category: "Fruits", image: "🍌", inStock: true, aiRecommended: true },
  { id: 2, name: "Fresh Strawberries", price: 4.99, category: "Fruits", image: "🍓", inStock: true },
  { id: 3, name: "Whole Milk", price: 3.49, category: "Dairy", image: "🥛", inStock: true, aiRecommended: true },
  { id: 4, name: "Free Range Eggs", price: 5.99, category: "Dairy", image: "🥚", inStock: true },
  { id: 5, name: "Sourdough Bread", price: 4.49, category: "Bakery", image: "🍞", inStock: true },
  { id: 6, name: "Chicken Breast", price: 8.99, category: "Meat", image: "🍗", inStock: true, aiRecommended: true },
  { id: 7, name: "Atlantic Salmon", price: 12.99, category: "Seafood", image: "🐟", inStock: true },
  { id: 8, name: "Avocados", price: 3.99, category: "Vegetables", image: "🥑", inStock: false },
  { id: 9, name: "Greek Yogurt", price: 4.29, category: "Dairy", image: "🥣", inStock: true },
  { id: 10, name: "Olive Oil", price: 9.99, category: "Pantry", image: "🫒", inStock: true },
  { id: 11, name: "Fresh Spinach", price: 3.29, category: "Vegetables", image: "🥬", inStock: true, aiRecommended: true },
  { id: 12, name: "Almond Butter", price: 7.99, category: "Pantry", image: "🥜", inStock: true },
];

const aiInsights = [
  { icon: TrendingUp, text: "Based on your history, you usually buy milk on Mondays" },
  { icon: Brain, text: "Customers who bought eggs also bought bread (87% match)" },
  { icon: Package, text: "Your pantry might be running low on olive oil" },
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => 
    ["All", ...new Set(products.map(p => p.category))], 
    []
  );

  const filteredProducts = useMemo(() => 
    products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }),
    [searchQuery, selectedCategory]
  );

  const addToCart = useCallback((product: Product) => {
    if (!product.inStock) {
      toast({ title: "Out of Stock", description: `${product.name} is currently unavailable`, variant: "destructive" });
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({ title: "Added to Cart", description: `${product.name} added successfully` });
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const cartTotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  
  const deliveryFee = useMemo(() => 
    cartTotal > 35 ? 0 : 4.99,
    [cartTotal]
  );

  return (
    <>
      <Helmet>
        <title>SmartCart - AI Grocery Delivery | Nizar Hussain</title>
        <meta name="description" content="AI-powered grocery delivery platform with personalized recommendations" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-emerald-950 to-background">
        <header className="sticky top-0 z-50 bg-emerald-950/95 backdrop-blur border-b border-emerald-800/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-emerald-400" />
                <span className="text-xl font-bold text-foreground">SmartCart</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Delivering to: San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Est. 25 min</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Card className="mb-8 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-emerald-700/50">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-emerald-400">AI Shopping Insights</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {aiInsights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <insight.icon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{insight.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search groceries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card border-emerald-800/50"
                    aria-label="Search groceries"
                    role="searchbox"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className={selectedCategory === cat 
                        ? "bg-emerald-600 hover:bg-emerald-700" 
                        : "border-emerald-800/50 hover:bg-emerald-900/50"}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <Card 
                    key={product.id} 
                    className={`bg-card border-emerald-800/30 hover:border-emerald-600/50 transition-all ${!product.inStock ? 'opacity-60' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-4xl">{product.image}</span>
                        {product.aiRecommended && (
                          <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-600/30">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Pick
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-emerald-400">${product.price.toFixed(2)}</span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="bg-emerald-600 hover:bg-emerald-700"
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {!product.inStock && (
                        <Badge variant="outline" className="mt-2 text-destructive border-destructive/50">
                          Out of Stock
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-card border-emerald-800/30">
                <CardHeader className="border-b border-emerald-800/30">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-emerald-400" />
                    Your Cart ({cart.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-emerald-900/20">
                          <span className="text-2xl">{item.image}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-emerald-400 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="border-t border-emerald-800/30 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Delivery</span>
                          <span className={deliveryFee === 0 ? "text-emerald-400" : ""}>
                            {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                          </span>
                        </div>
                        {deliveryFee > 0 && (
                          <p className="text-xs text-emerald-400">Add ${(35 - cartTotal).toFixed(2)} more for free delivery</p>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-emerald-800/30">
                          <span>Total</span>
                          <span className="text-emerald-400">${(cartTotal + deliveryFee).toFixed(2)}</span>
                        </div>
                      </div>

                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                        Checkout
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <footer className="border-t border-emerald-800/30 mt-16 py-8 bg-emerald-950/50">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground text-sm mb-4">
              <Badge variant="outline" className="mr-2">Demo Project</Badge>
              Built with AI/ML for personalized recommendations
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["React", "Node.js", "Python", "TensorFlow", "PostgreSQL", "Redis", "AWS"].map(tech => (
                <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;

