import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText, Users, Wallet, Shield, Scale, FileText, AlertCircle } from "lucide-react";

export default function ConstitutionPage() {
  const rules = [
    {
      icon: Users,
      title: "Membership Registration",
      rules: [
        "Members should register first either through our self-registration portal online or by the Community Agents.",
        "All registering members are to complete the KYM (Know Your Member) form provided online or in person."
      ]
    },
    {
      icon: Scale,
      title: "Governance",
      rules: [
        "A committee of 7 individuals will be elected from the stokvel members to represent the welfare of the members.",
        "This committee will be active for 12 months before a new one is elected.",
        "The founders of the venture cannot withdraw funds directly from the stokvel pool accounts."
      ]
    },
    {
      icon: Wallet,
      title: "Pool Account",
      rules: [
        "A pool bank account will be dedicated to receiving all monthly contributions.",
        "This account will solely be deposit taking and will be utilized as per the terms of the stokvel charter.",
        "Quarterly audits can be organized to ensure funds usage aligns with the charter and protect member funds."
      ]
    },
    {
      icon: FileText,
      title: "Contributions",
      rules: [
        "Registered members will contribute a fixed monthly fee to the pool by specified due dates as per the Round Charter.",
        "The figure can be changed depending on circumstances and member request.",
        "Any change in member contribution to be communicated 30 days before implementing the change."
      ]
    },
    {
      icon: Shield,
      title: "Member Responsibilities",
      rules: [
        "Stokvel members should read and understand the terms and policies availed on the website before registering.",
        "Grievances by members to follow protocol in order to ensure harmony and order of the community members.",
        "All new members are to pay a once off subscription of USD $3 as initiation fee."
      ]
    },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-10 md:py-16 px-3 md:px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <ScrollText className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Constitution</h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
            The rules and guidelines that govern our stokvel community.
          </p>
        </div>
      </section>

      {/* Rules */}
      <section className="py-10 md:py-16 px-3 md:px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-4 md:space-y-8">
            {rules.map((section) => (
              <Card key={section.title}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <section.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold">{section.title}</h2>
                  </div>
                  <ul className="space-y-2 md:space-y-3">
                    {section.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 md:gap-3">
                        <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs md:text-sm shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm md:text-base text-muted-foreground">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-10 md:py-16 px-3 md:px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-3 md:gap-4">
                <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-yellow-500 shrink-0" />
                <div>
                  <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Important Notice</h2>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-4">
                    During the registration process of all members, no one will pay any money. 
                    <strong> Registration is FREE</strong> and the contributions will only be required post registration.
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Members are advised to read and understand all terms and policies before registering 
                    to avoid any future misunderstanding of the model being used by all registered members.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Initiation Fee */}
      <section className="py-10 md:py-16 px-3 md:px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Initiation Fee</h2>
          <Card>
            <CardContent className="p-6 md:p-8">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-3 md:mb-4">USD $3</p>
              <p className="text-sm md:text-base text-muted-foreground">
                One-time subscription fee for all new members
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
