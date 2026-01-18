import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, Store, Megaphone, Clock } from "lucide-react";

export default function MarketplacePage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-10 md:py-16 px-3 md:px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Biggy Market Place</h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Your one-stop e-commerce platform for stokvel members to buy and sell.
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-10 md:py-16 px-3 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="text-center">
            <CardContent className="py-10 md:py-16">
              <Clock className="h-16 w-16 md:h-20 md:w-20 text-primary mx-auto mb-4 md:mb-6 opacity-50" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Coming Soon!</h2>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
                We're working hard to bring you the Biggy Market Place - an e-commerce platform 
                embedded in our website where registered stokvel members can advertise and sell 
                their products and services for FREE!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-10 md:py-16 px-3 md:px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">What to Expect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <Card>
              <CardContent className="p-4 md:p-6 text-center">
                <Store className="h-8 w-8 md:h-10 md:w-10 text-primary mx-auto mb-3 md:mb-4" />
                <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">Member Stores</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Create your own store and showcase your products
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6 text-center">
                <Megaphone className="h-8 w-8 md:h-10 md:w-10 text-primary mx-auto mb-3 md:mb-4" />
                <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">Free Advertising</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Advertise your products and services at no cost
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 md:p-6 text-center">
                <ShoppingBag className="h-8 w-8 md:h-10 md:w-10 text-primary mx-auto mb-3 md:mb-4" />
                <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">Easy Shopping</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Browse and buy from fellow community members
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-16 px-3 md:px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Don't Miss Out!</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            Register now to be among the first to access the Biggy Market Place when it launches.
          </p>
          <Button size="lg" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
