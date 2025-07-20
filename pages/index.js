import { useState } from 'react';
import Layout from '../components/Layout';
import { Shield, Heart, AlertTriangle, MapPin, MessageCircle, CheckSquare } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: AlertTriangle,
      title: "Red Flag Quiz",
      description: "Assess relationship warning signs with our comprehensive questionnaire",
      href: "/quiz",
      color: "bg-red-500"
    },
    {
      icon: Shield,
      title: "Emergency Guide",
      description: "Access safety resources and emergency contacts instantly",
      href: "/emergency",
      color: "bg-blue-500"
    },
    {
      icon: MapPin,
      title: "Location Warnings",
      description: "Get real-time alerts about risky locations near you",
      href: "/location",
      color: "bg-orange-500"
    },
    {
      icon: CheckSquare,
      title: "Safety Checklist",
      description: "Complete pre-travel safety preparation checklist",
      href: "/checklist",
      color: "bg-green-500"
    },
    {
      icon: MessageCircle,
      title: "AI Assessment",
      description: "Anonymous consultation with AI safety advisor",
      href: "/chat",
      color: "bg-purple-500"
    },
    {
      icon: MapPin,
      title: "Incident Map",
      description: "View reported incidents and high-risk areas",
      href: "/map",
      color: "bg-indigo-500"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-100 rounded-full">
                  <Heart className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Honeymoon
                <span className="text-red-600 block">Hazard Protection</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Advanced safety assessment tools designed to help identify potential risks 
                and provide critical resources for personal protection during vulnerable moments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quiz" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Start Assessment
                  <AlertTriangle className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/emergency" className="inline-flex items-center px-8 py-4 border-2 border-red-600 text-lg font-medium rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200">
                  Emergency Resources
                  <Shield className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Safety Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access multiple layers of protection through our integrated safety platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} href={feature.href}>
                  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-red-200 cursor-pointer">
                    <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center text-white mb-4 md:mb-0">
                <Shield className="w-8 h-8 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">In Immediate Danger?</h3>
                  <p className="text-red-100">Access emergency resources now</p>
                </div>
              </div>
              <div className="flex gap-4">
                <a href="tel:911" className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors">
                  Call 911
                </a>
                <Link href="/emergency" className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-colors">
                  Safety Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}