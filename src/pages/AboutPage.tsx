import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Lightbulb, Scale, Heart } from "lucide-react";
import takeHomeMoreImage from "@/assets/take-home-more.jpeg";

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Professionalism",
      description: "Demonstrating high standards of conduct, competence, and ethics. Showing reliability, respect, and accountability; consistently acting responsibly, communicating effectively. Showing integrity plus commitment to excellence."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Partnerships; producing or making something together. Coming together to achieve a goal or create value for our community members."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Developing new ideas, methods, products, services, or solutions that have a significant positive impact and value for our members. Thinking outside the box and bringing creative concepts into tangible outcomes."
    },
    {
      icon: Scale,
      title: "Equality",
      description: "Every member has the same value, rights, respect, and access to opportunities. The ground at Biggy Round stokvel is level."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We are excited to begin this journey and launch the biggest stokvel in Africa. Our enthusiasm drives everything we do."
    },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-10 md:py-16 px-3 md:px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">About Us</h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Building the biggest fulfilling stokvel community in Zimbabwe and Africa
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-10 md:py-16 px-3 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8 lg:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Our Vision</h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center">
                To establish the biggest fulfilling stokvel or 'round community' whose mission is to offer 
                real life value addition and innovative solutions to our members. We aim to create a 
                community where every member experiences the true meaning of Ubuntu and collective prosperity.
              </p>
              
              {/* Take Home More Image */}
              <div className="mt-6 md:mt-8">
                <img 
                  src={takeHomeMoreImage} 
                  alt="Take home more than what you paid for" 
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 md:py-16 px-3 md:px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {values.map((value) => (
              <Card key={value.title} className="h-full">
                <CardContent className="p-4 md:p-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 mb-3 md:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{value.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ubuntu Section */}
      <section className="py-10 md:py-16 px-3 md:px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">The Spirit of Ubuntu</h2>
          <blockquote className="text-xl md:text-2xl italic text-primary mb-4 md:mb-6">
            "I am because we are"
          </blockquote>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            This has been the African way of doing things as one community or as a people. 
            At Biggy Round, we embody this philosophy in everything we do. We believe that when 
            a group of people comes together with a common purpose, nothing they envision will be impossible.
          </p>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-10 md:py-16 px-3 md:px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-primary/20">
            <CardContent className="p-6 md:p-8 lg:p-12 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-7 w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Our Team</h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                A team of dedicated professionals who are passionate and well researched about the stokvel 
                industry; focused on creating the next big thing for our customers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-10 md:py-16 px-3 md:px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Our Mission</h2>
          <p className="text-base md:text-lg leading-relaxed opacity-90">
            A project for the people, by the people - start the journey together, grow together, 
            save together, buy together, invest together, farm together and have fun together. 
            We run with professionalism, sound administration and maximum customer satisfaction.
          </p>
          <p className="text-xl md:text-2xl font-bold mt-6 md:mt-8">
            Biggy Round is Bigger, Better and Bolder.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
