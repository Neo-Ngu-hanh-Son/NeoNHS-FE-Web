import { Card, CardContent } from "@/components/ui/card"
import {
    SafetyCertificateOutlined,
    HeartOutlined,
    GlobalOutlined,
    BulbOutlined,
    SmileOutlined,
    FacebookOutlined,
    TwitterOutlined,
    LinkedinOutlined,
} from "@ant-design/icons"

const values = [
    {
        icon: <SafetyCertificateOutlined className="text-4xl text-primary" />,
        title: "Authenticity",
        description: "We are committed to providing genuine and culturally accurate experiences that honor the traditions of Ngu Hanh Son.",
    },
    {
        icon: <HeartOutlined className="text-4xl text-primary" />,
        title: "Passion",
        description: "Our team is driven by a deep love for our heritage and a desire to share its beauty with the world.",
    },
    {
        icon: <GlobalOutlined className="text-4xl text-primary" />,
        title: "Community",
        description: "We work hand-in-hand with local artisans and residents to ensure tourism benefits the entire community.",
    },
    {
        icon: <BulbOutlined className="text-4xl text-primary" />,
        title: "Innovation",
        description: "Leveraging technology to create smart, seamless, and engaging travel experiences for modern explorers.",
    },
]

const teamMembers = [
    {
        name: "Chau Thanh Dat",
        role: "Leader",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    },
    {
        name: "Pham Minh Kiet",
        role: "Member",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    },
    {
        name: "Nguyen Quang Huy",
        role: "Member",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    },
    {
        name: "Doan Tran Quang Huy",
        role: "Member",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    },
    {
        name: "Le Nhat Truong",
        role: "Member",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    },
]

export function AboutUs() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[500px] w-full overflow-hidden flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1504198266287-1659872e6590?w=1600&q=80')",
                    }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">About Us</h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
                        Bridging the past and present, connecting you with the heart of Ngu Hanh Son.
                    </p>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className="py-20 px-4 md:px-8 lg:px-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                                Our Mission
                            </h2>
                            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                                At NeoNHS, our mission is to preserve and promote the rich cultural heritage of Ngu Hanh Son while fostering sustainable tourism. We believe that travel should be more than just sightseeing; it should be an immersion into the soul of a place.
                            </p>
                            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                                By connecting travelers with local artisans and offering smart, curated itineraries, we aim to create meaningful experiences that leave a lasting impact on both visitors and the local community.
                            </p>
                            <div className="flex gap-4 mt-8">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold text-primary">50+</span>
                                    <span className="text-sm text-muted-foreground">Local Partners</span>
                                </div>
                                <div className="w-px h-12 bg-gray-300"></div>
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-bold text-primary">10k+</span>
                                    <span className="text-sm text-muted-foreground">Happy Travelers</span>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 relative">
                            <img
                                src="https://images.unsplash.com/photo-1552353617-3bfd679b3bdd?w=800&q=80"
                                alt="Our Mission"
                                className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
                            />
                            <div className="absolute -z-10 top-10 -right-10 w-full h-full border-2 border-primary/20 rounded-2xl hidden lg:block"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-20 px-4 md:px-8 lg:px-20 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            The principles that guide every tour we plan and every connection we make.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <Card key={index} className="border-none shadow-md hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-8 text-center flex flex-col items-center h-full">
                                    <div className="mb-6 p-4 bg-primary/10 rounded-full inline-block">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet the Team Section */}
            <section className="py-20 px-4 md:px-8 lg:px-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Meet The Team
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            The passionate people behind NeoNHS
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="group text-center">
                                <div className="relative mb-4 overflow-hidden rounded-xl">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                        <a href="#" className="text-white hover:text-primary transition-colors"><FacebookOutlined className="text-xl" /></a>
                                        <a href="#" className="text-white hover:text-primary transition-colors"><TwitterOutlined className="text-xl" /></a>
                                        <a href="#" className="text-white hover:text-primary transition-colors"><LinkedinOutlined className="text-xl" /></a>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                                <p className="text-primary font-medium">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 md:px-8 lg:px-20 bg-primary/5">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block p-4 rounded-full bg-primary/10 mb-6">
                        <SmileOutlined className="text-4xl text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                        Ready to Explore Ngu Hanh Son?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of travelers who have discovered the magic of Vietnam's hidden gems with us.
                    </p>
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full text-lg font-semibold transition-colors duration-300">
                        Start Your Journey
                    </button>
                </div>
            </section>
        </div>
    )
}
