import { useState } from 'react';
import Layout from '../components/Layout';
import { AlertTriangle, CheckCircle, XCircle, RotateCcw, Link } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "Does your partner insist on planning the entire trip alone without your input?",
    weight: 3
  },
  {
    id: 2,
    question: "Do they hide their phone, computer, or travel history from you?",
    weight: 4
  },
  {
    id: 3,
    question: "Have they been secretive about the destination or accommodations?",
    weight: 3
  },
  {
    id: 4,
    question: "Do they discourage you from telling friends or family about your trip plans?",
    weight: 5
  },
  {
    id: 5,
    question: "Have they insisted on a very remote or isolated location?",
    weight: 4
  },
  {
    id: 6,
    question: "Do they control your access to money or travel documents?",
    weight: 5
  },
  {
    id: 7,
    question: "Have they shown signs of jealousy or possessiveness recently?",
    weight: 3
  },
  {
    id: 8,
    question: "Do they get angry when you ask questions about the trip details?",
    weight: 4
  },
  {
    id: 9,
    question: "Have they discouraged you from bringing your own transportation or phone?",
    weight: 4
  },
  {
    id: 10,
    question: "Do they have a history of controlling or manipulative behavior?",
    weight: 5
  },
  {
    id: 11,
    question: "Have they made threats (even seemingly joking ones) about the trip?",
    weight: 5
  },
  {
    id: 12,
    question: "Do they dismiss your concerns or call you paranoid when you ask questions?",
    weight: 4
  }
];

export default function Quiz() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateRiskScore = () => {
    let totalScore = 0;
    let maxPossibleScore = 0;

    questions.forEach(q => {
      maxPossibleScore += q.weight;
      if (answers[q.id] === 'yes') {
        totalScore += q.weight;
      }
    });

    return {
      score: totalScore,
      percentage: Math.round((totalScore / maxPossibleScore) * 100),
      maxScore: maxPossibleScore
    };
  };

  const getRiskLevel = (percentage) => {
    if (percentage >= 70) return { level: 'CRITICAL', color: 'text-red-600', bg: 'bg-red-50' };
    if (percentage >= 50) return { level: 'HIGH', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (percentage >= 30) return { level: 'MODERATE', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'LOW', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setCurrentQuestion(0);
  };

  const allQuestionsAnswered = Object.keys(answers).length === questions.length;
  const currentQuestionAnswered = answers[questions[currentQuestion]?.id] !== undefined;

  if (showResults) {
    const riskData = calculateRiskScore();
    const riskLevel = getRiskLevel(riskData.percentage);

    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full ${riskLevel.bg}`}>
                    <AlertTriangle className={`w-12 h-12 ${riskLevel.color}`} />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Assessment Results
                </h1>
                <div className={`inline-block px-6 py-3 rounded-full ${riskLevel.bg} ${riskLevel.color} font-semibold text-lg`}>
                  {riskLevel.level} RISK - {riskData.percentage}%
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Risk Analysis
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        riskData.percentage >= 70 ? 'bg-red-500' :
                        riskData.percentage >= 50 ? 'bg-orange-500' :
                        riskData.percentage >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${riskData.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-600">
                    Score: {riskData.score} out of {riskData.maxScore} points
                  </p>
                </div>

                {riskLevel.level === 'CRITICAL' && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
                    <h4 className="text-lg font-semibold text-red-900 mb-2">
                      ⚠️ CRITICAL RISK DETECTED
                    </h4>
                    <p className="text-red-800 mb-4">
                      Your responses indicate multiple serious warning signs. Consider postponing travel 
                      and seeking support from trusted friends, family, or professionals.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="tel:1-800-799-7233" className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                        Call Domestic Violence Hotline
                      </Link>
                      <Link href="/emergency" className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors">
                        View Safety Resources
                      </Link>
                    </div>
                  </div>
                )}

                {riskLevel.level === 'HIGH' && (
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                    <h4 className="text-lg font-semibold text-orange-900 mb-2">
                      ⚠️ HIGH RISK IDENTIFIED
                    </h4>
                    <p className="text-orange-800 mb-4">
                      Several concerning patterns detected. Consider having serious conversations 
                      about boundaries and potentially seeking guidance from trusted sources.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/checklist" className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
                        Safety Checklist
                      </Link>
                      <Link href="/emergency" className="bg-white text-orange-600 border border-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors">
                        Safety Resources
                      </Link>
                    </div>
                  </div>
                )}

                {riskLevel.level === 'MODERATE' && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
                    <h4 className="text-lg font-semibold text-yellow-900 mb-2">
                      ⚠️ MODERATE RISK NOTED
                    </h4>
                    <p className="text-yellow-800 mb-4">
                      Some warning signs present. Consider open communication with your partner 
                      and implementing additional safety precautions.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/checklist" className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
                        Safety Checklist
                      </Link>
                      <Link href="/location" className="bg-white text-yellow-600 border border-yellow-600 px-4 py-2 rounded-lg font-medium hover:bg-yellow-50 transition-colors">
                        Location Warnings
                      </Link>
                    </div>
                  </div>
                )}

                {riskLevel.level === 'LOW' && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                    <h4 className="text-lg font-semibold text-green-900 mb-2">
                      ✅ LOW RISK DETECTED
                    </h4>
                    <p className="text-green-800 mb-4">
                      Your responses suggest minimal immediate risk factors. Continue to stay 
                      aware and trust your instincts.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/checklist" className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Safety Checklist
                      </Link>
                      <Link href="/location" className="bg-white text-green-600 border border-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                        Location Check
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={resetQuiz}
                    className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Retake Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Red Flag Assessment
                </h1>
                <div className="text-sm text-gray-500">
                  {currentQuestion + 1} of {questions.length}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Question {currentQuestion + 1}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {questions[currentQuestion].question}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(questions[currentQuestion].id, 'yes')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    answers[questions[currentQuestion].id] === 'yes'
                      ? 'border-green-500 bg-red-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div className={`w-6 h-6 mr-3 ${
                      answers[questions[currentQuestion].id] === 'yes' ? 'text-red-600' : 'text-gray-400'
                    }`} />
                    <span className="text-lg font-medium">Yes</span>
                  </div>
                </button>
                <button
                  onClick={() => handleAnswer(questions[currentQuestion].id, 'no')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    answers[questions[currentQuestion].id] === 'no'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div className={`w-6 h-6 mr-3 ${
                      answers[questions[currentQuestion].id] === 'no' ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <span className="text-lg font-medium">No</span>
                  </div>
                </button>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={!currentQuestionAnswered}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}