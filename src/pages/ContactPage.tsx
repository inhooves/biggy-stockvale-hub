import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Clock, Facebook, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const contactNumbers = [
    { number: "+263 715 385 960", hasWhatsApp: true },
    { number: "+263 713 360 948", hasWhatsApp: true },
    { number: "+263 773 226 245", hasWhatsApp: true },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We will get back to you soon!",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're here to help! Reach out to us with any questions or concerns.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="mailto:admin@biggyround.co.zw" className="text-primary hover:underline">
                    admin@biggyround.co.zw
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Phone Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contactNumbers.map((contact) => (
                      <div key={contact.number} className="flex items-center gap-3">
                        <span>{contact.number}</span>
                        {contact.hasWhatsApp && (
                          <div className="flex gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <MessageCircle className="h-4 w-4 text-green-500" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Working Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Monday to Friday</p>
                  <p className="font-semibold">8:30 AM - 4:30 PM</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-primary" />
                    Social Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Facebook: Coming Soon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Careers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">To be advised</p>
                  <p className="text-sm">
                    Send resumes to: <a href="mailto:jobs@biggyround.co.zw" className="text-primary hover:underline">jobs@biggyround.co.zw</a>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
