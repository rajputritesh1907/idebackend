const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profilePicture: { type: String },
  username: { type: String, required: true },
  tagline: { type: String },
  location: { type: String },
  timezone: { type: String },
  joinDate: { type: Date, default: Date.now },
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    website: { type: String }
  },
  codingStats: {
    totalProblemsSolved: { type: Number, default: 0 },
    problemsSolvedByDifficulty: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 }
    },
    successRate: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    highestStreak: { type: Number, default: 0 },
    averageSubmissionTime: { type: Number, default: 0 }
  },
  skillOverview: {
    languagesUsed: [{ name: String, usagePercentage: Number }],
    frameworksKnown: [String],
    skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' },
    badges: [String]
  },
  achievements: {
    dailyChallengesCompleted: { type: Number, default: 0 },
    eventBadges: [String],
    specialAwards: [String]
  },
  activityTimeline: {
    recentSubmissions: [{
      problemId: String,
      verdict: { type: String, enum: ['Passed', 'Failed', 'Partially Solved'] },
      submissionDate: Date
    }],
    recentContests: [{ contestId: String, score: Number, rank: Number }],
    recentDiscussions: [String],
    recentCodeReviews: [String]
  },
  contestsAndRankings: {
    contestHistory: [{ contestId: String, score: Number, rank: Number }],
    globalRank: { type: Number },
    countryRank: { type: Number },
    ratingGraph: [{ date: Date, rating: Number }]
  },
  projectsAndContributions: {
    personalProjects: [{ name: String, link: String }],
    openSourceContributions: [String],
    codeSnippets: [String]
  },
  communityInteraction: {
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    commentsPosted: { type: Number, default: 0 },
    discussionThreadsStarted: { type: Number, default: 0 },
    answersAccepted: { type: Number, default: 0 }
  },
  recentMessages: [{
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    counterpart: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastMessage: String,
    updatedAt: { type: Date, default: Date.now }
  }],
  settings: {
    privacy: { type: String, enum: ['Public', 'Private'], default: 'Public' },
    notificationPreferences: { type: String },
    accountSecurity: {
      password: { type: String },
      twoFactorAuth: { type: Boolean, default: false },
      connectedAccounts: [String]
    }
  }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);