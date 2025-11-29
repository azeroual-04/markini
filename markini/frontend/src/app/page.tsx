import Link from 'next/link'
import { Calendar, Search, Video, FileText } from 'lucide-react'

/**
 * Home page
 * Landing page with hero section and feature highlights
 */
export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-600">Markini</h1>
                        </div>
                        <div className="flex space-x-4">
                            <Link href="/auth/login" className="text-gray-700 hover:text-primary-600">
                                Login
                            </Link>
                            <Link href="/auth/register" className="btn-primary">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-5xl font-bold mb-6">
                        Your Health, Our Priority
                    </h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Book appointments with top doctors, manage your medical records, and access teleconsultations from anywhere
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link href="/auth/register" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                            Get Started
                        </Link>
                        <Link href="/doctors" className="bg-primary-700 hover:bg-primary-800 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                            Find a Doctor
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-3xl font-bold text-center mb-12">Why Choose Markini?</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Search className="w-12 h-12 text-primary-600" />}
                            title="Find Doctors"
                            description="Search by specialty, location, and insurance to find the perfect doctor for you"
                        />
                        <FeatureCard
                            icon={<Calendar className="w-12 h-12 text-primary-600" />}
                            title="Easy Booking"
                            description="Book appointments in seconds with real-time availability"
                        />
                        <FeatureCard
                            icon={<Video className="w-12 h-12 text-primary-600" />}
                            title="Teleconsultation"
                            description="Connect with doctors via video calls from the comfort of your home"
                        />
                        <FeatureCard
                            icon={<FileText className="w-12 h-12 text-primary-600" />}
                            title="Medical Records"
                            description="Access your complete medical history anytime, anywhere"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of patients who trust Markini for their healthcare needs
                    </p>
                    <Link href="/auth/register" className="btn-primary text-lg py-3 px-8">
                        Create Your Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2024 Markini. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="card text-center hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-center mb-4">{icon}</div>
            <h4 className="text-xl font-semibold mb-2">{title}</h4>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}
