import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const reports = await prisma.report.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to last 10 reports
    });

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { reportData, githubUsername, atsScore, atsGrade, isPublic } = await request.json();

    const report = await prisma.report.create({
      data: {
        userId: session.user.id,
        githubUsername,
        reportData: JSON.stringify(reportData),
        atsScore,
        atsGrade,
        isPublic: isPublic || false,
        shareToken: isPublic ? generateShareToken() : null
      }
    });

    // Track analytics
    await prisma.analytics.create({
      data: {
        eventType: 'report_generated',
        githubUsername,
        userId: session.user.id,
        metadata: JSON.stringify({ atsScore, atsGrade })
      }
    });

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("Failed to save report:", error);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}

function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}