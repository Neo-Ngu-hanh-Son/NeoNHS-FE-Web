import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
    SendOutlined
} from "@ant-design/icons";

export function ContactUs() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[500px] w-full overflow-hidden flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1528127269322-539801943592?w=1600&q=80')",
                    }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
                        We'd love to hear from you. Get in touch with us for any inquiries or support.
                    </p>
                </div>
            </section>

            <section className="py-20 px-4 md:px-8 lg:px-20 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Information */}
                        <div className="lg:col-span-1 space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-6">Get In Touch</h2>
                                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                    Have a question about our tours, or need help planning your visit to Ngu Hanh Son? We're here to help!
                                </p>
                            </div>

                            <div className="space-y-6">
                                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <EnvironmentOutlined className="text-2xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Our Location</h3>
                                            <p className="text-muted-foreground">81 Huyen Tran Cong Chua, Hoa Hai, Ngu Hanh Son, Da Nang, Vietnam</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <PhoneOutlined className="text-2xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Phone Number</h3>
                                            <p className="text-muted-foreground">+84 123 456 789</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <MailOutlined className="text-2xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Email Address</h3>
                                            <p className="text-muted-foreground">contact@neonhs.com</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex items-start gap-4">
                                        <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <ClockCircleOutlined className="text-2xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Working Hours</h3>
                                            <p className="text-muted-foreground">Mon - Sun: 7:00 AM - 5:00 PM</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card className="border-none shadow-xl">
                                <CardContent className="p-8 md:p-12">
                                    <h2 className="text-2xl font-bold text-foreground mb-8">Send us a Message</h2>
                                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50/50"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50/50"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50/50"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                                            <input
                                                type="text"
                                                id="subject"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50/50"
                                                placeholder="How can we help you?"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                                            <textarea
                                                id="message"
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-gray-50/50 resize-none"
                                                placeholder="Write your message here..."
                                            ></textarea>
                                        </div>

                                        <Button className="w-full h-12 text-lg font-semibold flex items-center justify-center gap-2 group bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
                                            Send Message
                                            <SendOutlined className="transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ContactUs;
