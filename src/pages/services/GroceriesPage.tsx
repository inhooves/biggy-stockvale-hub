import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart, Truck, Shield, Calendar } from "lucide-react";
import groceriesHeroImage from "@/assets/groceries-hero.jpeg";

export default function GroceriesPage() {
  const foodItems = [
    "Rice", "Spaghetti", "Macaroni", "Corn mealie meal", "Beans", "Flour",
    "Peanut butter", "Jam", "Cooking Oil", "Sugar", "Salt", "Dilutable Juice",
    "Rooibos Teabags", "Packaged Soups (e.g. Royco)"
  ];

  const nonFoodItems = [
    "Washing Powder", "Dish washing liquid soap", "Green/Blue Bar soap",
    "Toilet Cleaner", "Scouring Powder (Vim)", "Sta Soft", "Toothpaste"
  ];

  const timeline = [
    { period: "24-30 of each month", activity: "Members deposit/transfer monthly contribution to pool account" },
    { period: "1-9 of each month", activity: "Bulk grocery purchases processed and goods assembled at warehouse" },
    { period: "10-20 of each month", activity: "Door-to-door deliveries to contributing members" },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="w-20 h-20 mx-auto md:mx-0 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Biggy Groceries</h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Pool your resources for collective grocery purchases and enjoy major discounts with door-to-door delivery.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src={groceriesHeroImage} 
                alt="Take home more than what you paid for" 
                className="w-72 h-48 md:w-80 md:h-56 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Members contribute a designated monthly fee to the stokvel pool account for collective "round" 
            grocery purchases every month. Because the greater populace target market falls within the low 
            to middle income class, pooling resources allows us to buy in bulk (tonnes) for maximum savings.
          </p>
          
          <div className="grid gap-6 mb-12">
            {timeline.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.period}</h3>
                    <p className="text-muted-foreground">{item.activity}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingCart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Major Discounts</h3>
                <p className="text-muted-foreground">Get more units for the same value than buying alone</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Truck className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Door-to-Door Delivery</h3>
                <p className="text-muted-foreground">Groceries delivered directly to your address</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Grocery Insurance</h3>
                <p className="text-muted-foreground">Protection in case of damage during delivery</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Grocery List */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">Basic Grocery List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Food Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-2 gap-2">
                  {foodItems.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Non-Food Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 gap-2">
                  {nonFoodItems.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-8">Grocery Categories</h2>
          <p className="text-center text-muted-foreground mb-8">
            The Groceries Stokvel is divided into 5 categories, each with a different contribution fee:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Household Basic Groceries</h3>
                <p className="text-muted-foreground text-sm">Essential household items for families</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Boarding Students Tuck</h3>
                <p className="text-muted-foreground text-sm">Supplies for boarding school students</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Baby Welfare</h3>
                <p className="text-muted-foreground text-sm">Pampers and milk for young toddlers</p>
              </CardContent>
            </Card>
            <Card className="text-center border-primary/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-primary">Biggy "Wants" Groceries</h3>
                <p className="text-muted-foreground text-sm">Household items which are not basics. For example: powder milk, tomato sauce, and coffee.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-primary/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-primary">Biggy Premium Groceries</h3>
                <p className="text-muted-foreground text-sm">High quality, specialty and artisanal products. For example: whole wheat pasta and millet mealie meal.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Saving on Groceries Today</h2>
          <p className="text-lg mb-8 opacity-90">
            Join Biggy Groceries and enjoy bulk buying benefits.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
