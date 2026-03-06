import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubUser, fetchUserRepos, checkRateLimit } from "@/lib/github";
import { analyzeRepos } from "@/lib/analyzer";
import { matchRoles, generateRoleRecommendations } from "@/lib/roleMatcher";
import { generateAIInsights } from "@/lib/ai";
import { calculateATSScore } from "@/lib/atsScoring";
import { DevLensReport } from "@/types/profile";

interface AnalyzeRequest {
  username: string;
  saveReport?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: AnalyzeRequest = await request.json();
    const { username, saveReport = false } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: "Username is required and must be a string" },
        { status: 400 }
      );
    }

    // Check GitHub API rate limit
    const rateLimit = await checkRateLimit();
    if (rateLimit.remaining < 10) {
      return NextResponse.json(
        { 
          error: "GitHub API rate limit exceeded", 
          resetTime: rateLimit.resetTime 
        },
        { status: 429 }
      );
    }

    // Fetch user data and repositories
    console.log(`Analyzing GitHub profile: ${username}`);
    
    const [user, repos] = await Promise.all([
      fetchGitHubUser(username),
      fetchUserRepos(username)
    ]);

    console.log(`Fetched ${repos.length} repositories for ${username}`);

    // Analyze the data
    const analysis = analyzeRepos(repos);
    console.log(`Analysis complete: ${analysis.topLanguages.length} languages detected`);

    // Match against roles
    const roles = matchRoles(analysis.techStack, analysis.topLanguages);
    console.log(`Role matching complete`);

    // Calculate ATS Score
    const atsScore = calculateATSScore(user, analysis, roles);
    console.log(`ATS score calculated: ${atsScore.total}/100`);

    // Generate recommendations
    const recommendations = generateRoleRecommendations(roles);

    // Generate AI insights
    const insights = generateAIInsights(username, analysis, roles);
    console.log(`AI insights generated`);

    // Build the complete report
    const report: DevLensReport = {
      user,
      analysis,
      roles,
      insights,
      generatedAt: new Date().toISOString()
    };

    // Add recommendations to insights
    report.insights.improvementRoadmap = [
      `🎯 Best Role Match: ${recommendations.bestMatch}`,
      ...recommendations.recommendations,
      ...report.insights.improvementRoadmap
    ];

    console.log(`Report generated successfully for ${username}`);

    return NextResponse.json({ 
      ...report, 
      atsScore
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      }
    });

  } catch (error: any) {
    console.error("Analysis error:", error);
    
    // Handle specific error types
    if (error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    if (error.message.includes("rate limit")) {
      return NextResponse.json(
        { error: "GitHub API rate limit exceeded" },
        { status: 429 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { 
        error: "An error occurred while analyzing the profile",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for health check)
export async function GET() {
  return NextResponse.json(
    {
      message: "DevLens API is running",
      endpoints: {
        analyze: "POST /api/analyze"
      }
    },
    { status: 200 }
  );
}