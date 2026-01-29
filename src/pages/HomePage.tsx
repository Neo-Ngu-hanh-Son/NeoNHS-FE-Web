import { Card, CardContent } from "@/components/ui/card"
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  CompassOutlined,
  CameraOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons"

import hero from "@/assets/images/hero.jpg"
import googlePlayBtn from "@/assets/button/ggplaylight.png"
import appStoreBtn from "@/assets/button/appstorelight.png"
const landmarks = [
  {
    id: 1,
    name: "Linh Ung Pagoda",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80",
  },
  {
    id: 2,
    name: "Marble Mountains",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80",
  },
  {
    id: 3,
    name: "Am Phu Cave",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
  {
    id: 4,
    name: "Huyen Khong Cave",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
  },
]

const features = [
  {
    icon: <CompassOutlined className="text-2xl" />,
    title: "Guided Tours",
    description: "AI-powered tour planning tailored to your interests and schedule for the perfect cultural journey.Expert local guides for an authentic experience",
  },
  {
    icon: <CameraOutlined className="text-2xl" />,
    title: "Authentic Workshops",
    description: "Hands-on experiences with master craftsmen in traditional stone carving and local arts.",
  },
  {
    icon: <TeamOutlined className="text-2xl" />,
    title: "Cultural Heritage",
    description: "Deep dive into the rich history and living traditions of Ngu Hanh Son Ward.",
  },
  {
    icon: <SafetyCertificateOutlined className="text-2xl" />,
    title: "Local Connection",
    description: "Direct support to local artisans and communities through our integrated commerce platform.",
  },
]

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[1000px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-start justify-center text-left text-white px-8 md:px-16 lg:px-24 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Start your journey in Ngu Hanh Son, explore beautiful place!
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 text-white/90">
            Guided tours of tourist attractions with smart itineraries, and participation in workshops at traditional craft villages.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="transition-transform hover:scale-105">
              <img src={googlePlayBtn} alt="Get it on Google Play" className="h-12 md:h-14" />
            </a>
            <a href="#" className="transition-transform hover:scale-105">
              <img src={appStoreBtn} alt="Download on the App Store" className="h-12 md:h-14" />
            </a>
          </div>
        </div>
      </section>

      {/* Landmarks Section */}
      <section className="py-20 px-4 md:px-8 lg:px-20 bg-white">
        <div className=" mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover the most iconic landmarks of Ngu Hanh Son
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {landmarks.map((landmark) => (
              <Card
                key={landmark.id}
                className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={landmark.image}
                    alt={landmark.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-semibold text-lg">
                      {landmark.name}
                    </h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 lg:px-20 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80"
                alt="Ngu Hanh Son Experience"
                className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 rounded-2xl -z-10" />
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Visit Ngu Hanh Son?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Experience authentic cultural heritage through our integrated
                platform connecting tourists with local artisans and traditional
                craft villages.
              </p>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 md:px-8 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Us Here
            </h2>
            <p className="text-muted-foreground text-lg">
              Located in the heart of Da Nang, Vietnam
            </p>
          </div>
          {/* Map - Centered */}
          <Card className="overflow-hidden h-[700px] mb-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15338.677770917762!2d108.26359!3d16.0044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314217e75e8ce5a9%3A0x1c6e1f3a71c8e3e9!2sNgu%20Hanh%20Son%2C%20Da%20Nang%2C%20Vietnam!5e0!3m2!1sen!2s!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ngu Hanh Son Location"
            />
          </Card>

          {/* Contact Info - Horizontal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                  <EnvironmentOutlined className="text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-muted-foreground text-sm">
                    Ngu Hanh Son Ward, Da Nang, Vietnam
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                  <PhoneOutlined className="text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-muted-foreground text-sm">
                    +84 236 123 4567
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                  <MailOutlined className="text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">
                    info@nguhanhson.vn
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                  <ClockCircleOutlined className="text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Opening Hours</h3>
                  <p className="text-muted-foreground text-sm">
                    Daily: 7:00 AM - 5:30 PM
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}
