 import { useState } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { Gamepad2, PartyPopper, Skull, ArrowLeft } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { PageLayout } from '@/components/PageLayout';
 
 const funOptions = [
   {
     id: 'funday',
     title: 'Biggy Fun Day',
     description: 'Join our exciting community fun days filled with games, prizes, and entertainment!',
     icon: PartyPopper,
     path: '/fun/funday',
     color: 'text-yellow-500',
     bgColor: 'bg-yellow-500/10',
   },
   {
     id: 'doordie',
     title: 'Biggy Do or Die',
     description: 'High-stakes games where fortune favors the bold. Are you ready for the challenge?',
     icon: Skull,
     path: '/fun/doordie',
     color: 'text-red-500',
     bgColor: 'bg-red-500/10',
   },
 ];
 
 const FunGamesPage = () => {
   const navigate = useNavigate();
   const [hoveredCard, setHoveredCard] = useState<string | null>(null);
 
   return (
     <PageLayout>
       <div className="container mx-auto px-4 py-12">
         {/* Header */}
         <div className="mb-8">
           <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
             <ArrowLeft size={16} className="mr-2" />
             Back
           </Button>
           <div className="flex items-center gap-3 mb-4">
             <Gamepad2 className="h-10 w-10 text-primary" />
             <h1 className="font-display text-4xl font-bold text-foreground">Biggy Fun & Games</h1>
           </div>
           <p className="text-lg text-muted-foreground max-w-2xl">
             Welcome to the exciting world of Biggy entertainment! Choose your adventure below.
           </p>
         </div>
 
         {/* Side Panel Cards */}
         <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
           {funOptions.map((option) => {
             const Icon = option.icon;
             return (
               <Link 
                 key={option.id} 
                 to={option.path}
                 onMouseEnter={() => setHoveredCard(option.id)}
                 onMouseLeave={() => setHoveredCard(null)}
               >
                 <Card 
                   className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 ${
                     hoveredCard === option.id ? 'border-primary' : 'border-border'
                   }`}
                 >
                   <CardHeader>
                     <div className={`w-16 h-16 rounded-xl ${option.bgColor} flex items-center justify-center mb-4`}>
                       <Icon className={`h-8 w-8 ${option.color}`} />
                     </div>
                     <CardTitle className="text-2xl">{option.title}</CardTitle>
                     <CardDescription className="text-base">{option.description}</CardDescription>
                   </CardHeader>
                   <CardContent>
                     <Button variant="outline" className="w-full group">
                       Explore
                       <ArrowLeft className="ml-2 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
                     </Button>
                   </CardContent>
                 </Card>
               </Link>
             );
           })}
         </div>
       </div>
     </PageLayout>
   );
 };
 
 export default FunGamesPage;