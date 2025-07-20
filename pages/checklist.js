import { useState } from 'react';
import Layout from '../components/Layout';
import { CheckSquare, Check, X, Download, Share2, AlertTriangle, Link } from 'lucide-react';

const checklistItems = [
  {
    category: "Pre-Travel Communication",
    items: [
      {
        id: 1,
        text: "Does your partner openly discuss travel plans and destination?",
        critical: true,
        explanation: "Secrecy about travel plans can be a major warning sign. Partners should openly share itineraries, accommodations, and activities."
      },
      {
        id: 2,
        text: "Are you allowed to share travel plans with family and friends?",
        critical: true,
        explanation: "Isolation tactics often start with discouraging communication with your support network."
      },
      {
        id: 3,
        text: "Can you access and review travel bookings and reservations?",
        critical: false,
        explanation: "You should have access to confirm accommodations, transportation, and activities for your own safety."
      },
      {
        id: 4,
        text: "Have you researched the destination independently?",
        critical: false,
        explanation: "Understanding your destination, local customs, and safety considerations is important."
      }
    ]
  },
  {
    category: "Financial Independence",
    items: [
      {
        id: 5,
        text: "Do you have access to your own money/credit cards?",
        critical: true,
        explanation: "Financial control is a common abuse tactic. You should always have independent access to funds."
      },
      {
        id: 6,
        text: "Do you have emergency cash that your partner doesn't know about?",
        critical: true,
        explanation: "Emergency funds provide crucial independence and escape options if needed."
      },
      {
        id: 7,
        text: "Can you make purchases without needing permission?",
        critical: false,
        explanation: "Financial autonomy is a basic right in healthy relationships."
      }
    ]
  },
  {
    category: "Communication & Documentation",
    items: [
      {
        id: 8,
        text: "Do you have unrestricted access to your phone?",
        critical: true,
        explanation: "Phone monitoring or restrictions are serious red flags for controlling behavior."
      },
      {
        id: 9,
        text: "Have you shared your itinerary with trusted contacts?",
        critical: true,
        explanation: "Multiple people should know your travel plans and expected return."
      },
      {
        id: 10,
        text: "Do you have copies of important documents (ID, passport, etc.)?",
        critical: false,
        explanation: "Document control is another form of isolation. Keep copies in a safe, accessible place."
      },
      {
        id: 11,
        text: "Have you established check-in times with trusted contacts?",
        critical: false,
        explanation: "Regular check-ins provide accountability and early warning if something goes wrong."
      }
    ]
  },
  {
    category: "Personal Safety",
    items: [
      {
        id: 12,
        text: "Do you know the local emergency numbers for your destination?",
        critical: false,
        explanation: "Emergency numbers vary by country. Research and save them before traveling."
      },
      {
        id: 13,
        text: "Have you researched safe places (hospitals, police stations) at your destination?",
        critical: false,
        explanation: "Knowing safe locations provides escape options if needed."
      },
      {
        id: 14,
        text: "Do you have a safety plan if something goes wrong?",
        critical: true,
        explanation: "Having a clear safety plan can save crucial time in emergency situations."
      },
      {
        id: 15,
        text: "Are you comfortable with all planned activities?",
        critical: false,
        explanation: "You should never feel pressured into activities that make you uncomfortable."
      }
    ]
  },
  {
    category: "Trust Your Instincts",
    items: [
      {
        id: 16,
        text: "Do you feel genuinely excited about this trip?",
        critical: false,
        explanation: "Trust your gut feelings. Anxiety or dread about a trip may indicate underlying concerns."
      },
      {
        id: 17,
        text: "Would you feel comfortable if a friend was in your situation?",
        critical: true,
        explanation: "Sometimes it's easier to see red flags when we imagine them happening to someone we care about."
      },
      {
        id: 18,
        text: "Do you trust your partner completely?",
        critical: true,
        explanation: "Travel requires vulnerability. Complete trust is essential for safety."
      }
    ]
  }
];

export default function Checklist() {
  const [checkedItems, setCheckedItems] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleItemCheck = (itemId, checked) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const calculateRiskScore = () => {
    let criticalIssues = 0;
    let totalIssues = 0;
    let criticalTotal = 0;
    let totalItems = 0;

    checklistItems.forEach(category => {
      category.items.forEach(item => {
        totalItems++;
        if (item.critical) criticalTotal++;
        
        // "No" answers indicate potential issues
        if (checkedItems[item.id] === false) {
          totalIssues++;
          if (item.critical) criticalIssues++;
        }
      });
    });

    return {
      criticalIssues,
      totalIssues,
      criticalTotal,
      totalItems,
      criticalPercentage: Math.round((criticalIssues / criticalTotal) * 100),
      overallPercentage: Math.round((totalIssues / totalItems) * 100)
    };
  };

  const getRiskLevel = () => {
    const scores = calculateRiskScore();
    if (scores.criticalIssues >= 3 || scores.criticalPercentage >= 50) {
      return { level: 'CRITICAL', color: 'text-red-600', bg: 'bg-red-50' };
    } else if (scores.criticalIssues >= 1 || scores.overallPercentage >= 30) {
      return { level: 'MODERATE', color: 'text-orange-600', bg: 'bg-orange-50' };
    }
    return { level: 'LOW', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const getCompletionPercentage = () => {
    const totalItems = checklistItems.reduce((sum, category) => sum + category.items.length, 0);
    const checkedCount = Object.keys(checkedItems).length;
    return Math.round((checkedCount / totalItems) * 100);
  };

  const downloadChecklist = () => {
    // In a real implementation, this would generate a proper PDF or text file
    const checklistText = checklistItems.map(category => 
      `${category.category}:\n${category.items.map(item => 
        `□ ${item.text}`
      ).join('\n')}\n`
    ).join('\n');

    const blob = new Blob([checklistText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safety-checklist.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareChecklist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Travel Safety Checklist',
        text: 'Important safety checklist for travel planning',
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const allItemsCompleted = Object.keys(checkedItems).length === checklistItems.reduce((sum, category) => sum + category.items.length, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckSquare className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Safe Travel Checklist
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential safety questions to ask before any trip. Trust your instincts and prioritize your safety.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
              <span className="text-sm text-gray-600">
                {getCompletionPercentage()}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
            {allItemsCompleted && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowResults(true)}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  View Assessment Results
                </button>
              </div>
            )}
          </div>

          {/* Results Modal */}
          {showResults && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Results</h2>
                  {(() => {
                    const riskLevel = getRiskLevel();
                    const scores = calculateRiskScore();
                    
                    return (
                      <div>
                        <div className={`inline-block px-6 py-3 rounded-full ${riskLevel.bg} ${riskLevel.color} font-semibold text-lg mb-4`}>
                          {riskLevel.level} RISK LEVEL
                        </div>
                        
                        <div className="space-y-4 text-left">
                          {riskLevel.level === 'CRITICAL' && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                              <h4 className="font-semibold text-red-900 mb-2">⚠️ CRITICAL SAFETY CONCERNS</h4>
                              <p className="text-red-800 mb-3">
                              You answered &quot;No&quot; to {scores.criticalIssues} critical safety {scores.criticalIssues === 1 ? "question" : "questions"}.
                                These indicate serious potential risks that should not be ignored.
                              </p>
                              <div className="space-y-2">
                                <a href="tel:1-800-799-7233" className="block bg-red-600 text-white px-4 py-2 rounded text-center font-medium hover:bg-red-700 transition-colors">
                                  Call Domestic Violence Hotline
                                </a>
                                <Link href="/emergency" className="block bg-white text-red-600 border border-red-600 px-4 py-2 rounded text-center font-medium hover:bg-red-50 transition-colors">
                                  View Emergency Resources
                                </Link>
                              </div>
                            </div>
                          )}
                          
                          {riskLevel.level === 'MODERATE' && (
                            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl">
                              <h4 className="font-semibold text-orange-900 mb-2">⚠️ MODERATE CONCERNS IDENTIFIED</h4>
                              <p className="text-orange-800">
                                Some safety concerns detected. Consider addressing these issues before traveling 
                                and implementing additional safety measures.
                              </p>
                            </div>
                          )}
                          
                          {riskLevel.level === 'LOW' && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
                              <h4 className="font-semibold text-green-900 mb-2">✅ GOOD SAFETY FOUNDATION</h4>
                              <p className="text-green-800">
                                Your responses suggest good safety practices. Continue to trust your instincts 
                                and stay alert while traveling.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowResults(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={downloadChecklist}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Checklist
            </button>
            <button
              onClick={shareChecklist}
              className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Checklist
            </button>
          </div>

          {/* Checklist Items */}
          <div className="space-y-8">
            {checklistItems.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {category.category}
                </h2>
                
                <div className="space-y-4">
                  {category.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start">
                            <div className="flex items-center mr-4">
                              {item.critical && (
                                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                              )}
                              <span className={`text-lg font-medium ${item.critical ? 'text-red-900' : 'text-gray-900'}`}>
                                {item.text}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                            {item.explanation}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleItemCheck(item.id, true)}
                            className={`p-2 rounded-lg font-medium transition-colors ${
                              checkedItems[item.id] === true
                                ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:border-green-400'
                            }`}
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleItemCheck(item.id, false)}
                            className={`p-2 rounded-lg font-medium transition-colors ${
                              checkedItems[item.id] === false
                                ? 'bg-red-100 text-red-700 border-2 border-red-500'
                                : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:border-red-400'
                            }`}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Important Notice */}
          <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Trust Your Instincts
                </h3>
                <p className="text-yellow-800">
                  This checklist is a tool to help you reflect on your situation. If anything feels wrong 
                  or unsafe, trust your gut feelings. No checklist can replace your own intuition about 
                  your safety and well-being. When in doubt, seek advice from trusted friends, family, 
                  or professional counselors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}