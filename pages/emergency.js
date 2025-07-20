import { useState } from 'react';
import Layout from '../components/Layout';
import { Phone, Shield, Download, AlertTriangle, MapPin, Heart, Clock, FileText } from 'lucide-react';

const emergencyNumbers = {
  national: [
    { name: "Emergency Services", number: "911", description: "Police, Fire, Medical" },
    { name: "National Domestic Violence Hotline", number: "1-800-799-7233", description: "24/7 confidential support" },
    { name: "Crisis Text Line", number: "Text HOME to 741741", description: "24/7 crisis support via text" },
    { name: "National Sexual Assault Hotline", number: "1-800-656-4673", description: "RAINN 24/7 support" },
    { name: "National Suicide Prevention Lifeline", number: "988", description: "24/7 mental health crisis support" }
  ],
  regional: {
    "California": [
      { name: "CA Domestic Violence Hotline", number: "1-800-524-4765", description: "State-specific resources" }
    ],
    "New York": [
      { name: "NY State Domestic Violence Hotline", number: "1-800-942-6906", description: "State-specific resources" }
    ],
    "Texas": [
      { name: "TX Council on Family Violence", number: "1-800-525-1978", description: "State-specific resources" }
    ],
    "Florida": [
      { name: "FL Coalition Against Domestic Violence", number: "1-800-500-1119", description: "State-specific resources" }
    ]
  }
};

const safetySteps = [
  {
    title: "Recognize Danger Signs",
    icon: AlertTriangle,
    steps: [
      "Partner becomes increasingly controlling or possessive",
      "Isolation from friends and family increases",
      "Verbal threats or intimidation escalate",
      "Physical aggression or violence occurs",
      "Access to resources (money, phone, transportation) is restricted"
    ]
  },
  {
    title: "Immediate Safety Actions",
    icon: Shield,
    steps: [
      "Trust your instincts - if something feels wrong, it probably is",
      "Keep your phone charged and accessible at all times",
      "Memorize important phone numbers",
      "Identify safe locations and escape routes",
      "Have a code word with trusted friends/family for emergencies"
    ]
  },
  {
    title: "If Being Followed",
    icon: MapPin,
    steps: [
      "Do NOT go home - go to a public, well-lit area",
      "Drive to a police station, fire station, or hospital",
      "Call 108 immediately",
      "Vary your route and make unexpected turns",
      "If on foot, go into a store or public building"
    ]
  },
  {
    title: "Emergency Preparation",
    icon: Clock,
    steps: [
      "Keep emergency cash hidden in a safe place",
      "Have copies of important documents ready",
      "Pack a small emergency bag if possible",
      "Establish a safety plan with trusted contacts",
      "Know the locations of local shelters and safe houses"
    ]
  }
];

export default function Emergency() {
  const [selectedState, setSelectedState] = useState('');
  const [activeTab, setActiveTab] = useState('numbers');

  const generatePDF = () => {
    // In a real implementation, this would generate a proper PDF
    // For now, we'll create a printable version
    window.print();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <Shield className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Emergency Safety Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Critical resources and step-by-step guidance for emergency situations
            </p>
          </div>

          {/* Emergency Banner */}
          <div className="bg-red-600 text-white rounded-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <Phone className="w-8 h-8 mr-4" />
                <div>
                  <h2 className="text-xl font-bold">In Immediate Danger?</h2>
                  <p className="text-red-100">Call emergency services now</p>
                </div>
              </div>
              <div className="flex gap-4">
                <a href="tel:911" className="bg-white text-red-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-red-50 transition-colors">
                  Call 108
                </a>
                <a href="tel:1-800-799-7233" className="border-2 border-white text-white px-6 py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-colors">
                  DV Hotline
                </a>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('numbers')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'numbers'
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Phone className="w-5 h-5 mx-auto mb-1" />
                  Emergency Numbers
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'guide'
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Shield className="w-5 h-5 mx-auto mb-1" />
                  Safety Guide
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'resources'
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="w-5 h-5 mx-auto mb-1" />
                  Resources
                </button>
              </nav>
            </div>

            <div className="p-8">
              {activeTab === 'numbers' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">National Emergency Numbers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {emergencyNumbers.national.map((contact, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6">
                          <h4 className="font-semibold text-gray-900 mb-2">{contact.name}</h4>
                          <a href={`tel:${contact.number.replace(/[^0-9]/g, '')}`} className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors">
                            {contact.number}
                          </a>
                          <p className="text-gray-600 mt-2">{contact.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">State-Specific Resources</h3>
                    <div className="mb-6">
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select your state</option>
                        {Object.keys(emergencyNumbers.regional).map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    {selectedState && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {emergencyNumbers.regional[selectedState].map((contact, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <h4 className="font-semibold text-gray-900 mb-2">{contact.name}</h4>
                            <a href={`tel:${contact.number.replace(/[^0-9]/g, '')}`} className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                              {contact.number}
                            </a>
                            <p className="text-gray-600 mt-2">{contact.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'guide' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Emergency Safety Protocol</h3>
                    <p className="text-gray-600">Step-by-step guidance for dangerous situations</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {safetySteps.map((section, index) => {
                      const Icon = section.icon;
                      return (
                        <div key={index} className="bg-gray-50 rounded-xl p-6">
                          <div className="flex items-center mb-4">
                            <div className="p-3 bg-red-100 rounded-lg mr-4">
                              <Icon className="w-6 h-6 text-red-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900">{section.title}</h4>
                          </div>
                          <ul className="space-y-3">
                            {section.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-gray-700">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h3>
                    <p className="text-gray-600">Support organizations and helpful tools</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <Heart className="w-8 h-8 text-purple-600 mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">RAINN</h4>
                      <p className="text-gray-600 mb-4">R@pe, Abuse & Incest National Network</p>
                      <a href="https://www.rainn.org" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium">
                        Visit Website →
                      </a>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <Shield className="w-8 h-8 text-green-600 mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">National Coalition Against DV</h4>
                      <p className="text-gray-600 mb-4">Comprehensive domestic violence resources</p>
                      <a href="https://ncadv.org" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium">
                        Visit Website →
                      </a>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <MapPin className="w-8 h-8 text-blue-600 mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">Local Shelters</h4>
                      <p className="text-gray-600 mb-4">Find safe housing in your area</p>
                      <a href="https://www.domesticshelters.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">
                        Find Shelters →
                      </a>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-xl p-8">
                    <div className="text-center">
                      <Download className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-900 mb-4">Printable Safety Guide</h4>
                      <p className="text-gray-600 mb-6">
                        Download or print this emergency guide for offline access
                      </p>
                      <button
                        onClick={generatePDF}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Print Safety Guide
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}