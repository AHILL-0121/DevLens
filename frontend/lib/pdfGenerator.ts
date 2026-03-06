import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DevLensReport } from '@/types/profile';
import { ATSScoreBreakdown } from '@/lib/atsScoring';

export async function generateResumePDF(
  report: DevLensReport,
  atsScore: ATSScoreBreakdown
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10, lineHeight = 1.15) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * fontSize * 0.35 * lineHeight);
  };

  // Helper to check page break
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > 280) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper to draw horizontal line
  const drawLine = (y: number, thickness = 0.5) => {
    pdf.setLineWidth(thickness);
    pdf.setDrawColor(100, 100, 100);
    pdf.line(margin, y, pageWidth - margin, y);
  };

  // ============================================
  // HEADER - Name and Contact Information
  // ============================================
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  const name = report.user.name || report.user.login;
  pdf.text(name.toUpperCase(), pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  // Contact Information
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const contactInfo = [
    `GitHub: github.com/${report.user.login}`,
    report.user.email || '',
    report.user.location || '',
    report.user.blog || ''
  ].filter(Boolean).join(' | ');
  
  pdf.text(contactInfo, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 6;

  drawLine(yPosition);
  yPosition += 8;

  // ============================================
  // PROFESSIONAL SUMMARY
  // ============================================
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PROFESSIONAL SUMMARY', margin, yPosition);
  yPosition += 6;

  pdf.setFontSize(9.5);
  pdf.setFont('helvetica', 'normal');
  
  // Get best role match
  const bestRole = Object.entries(report.roles).reduce((best, current) => 
    current[1].score > best[1].score ? current : best
  );
  
  const summaryText = report.insights.linkedinHeadline || 
    `Results-driven ${bestRole[0]} Developer with expertise in ${report.analysis.topLanguages.slice(0, 3).join(', ')}. Demonstrated experience through ${report.analysis.totalRepos} public repositories with ${report.analysis.totalStars} stars. Strong background in ${report.analysis.techStack.slice(0, 4).join(', ')}, with proven ability to deliver high-quality software solutions.`;
  
  yPosition = addText(summaryText, margin, yPosition, pageWidth - 2 * margin, 9.5);
  yPosition += 8;

  // ============================================
  // TECHNICAL SKILLS
  // ============================================
  checkPageBreak(40);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TECHNICAL SKILLS', margin, yPosition);
  yPosition += 6;

  pdf.setFontSize(9.5);
  
  // Programming Languages
  pdf.setFont('helvetica', 'bold');
  pdf.text('Programming Languages:', margin + 2, yPosition);
  pdf.setFont('helvetica', 'normal');
  yPosition = addText(report.analysis.topLanguages.join(', '), margin + 48, yPosition, pageWidth - margin - 50, 9.5, 1.2);
  yPosition += 2;

  // Frameworks & Technologies
  if (report.analysis.techStack.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Frameworks & Technologies:', margin + 2, yPosition);
    pdf.setFont('helvetica', 'normal');
    yPosition = addText(report.analysis.techStack.slice(0, 15).join(', '), margin + 48, yPosition, pageWidth - margin - 50, 9.5, 1.2);
    yPosition += 2;
  }

  // Additional Skills from insights
  if (report.insights.skillsSection.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Additional Skills:', margin + 2, yPosition);
    pdf.setFont('helvetica', 'normal');
    const additionalSkills = report.insights.skillsSection
      .filter(skill => !report.analysis.topLanguages.includes(skill) && !report.analysis.techStack.includes(skill))
      .slice(0, 10);
    if (additionalSkills.length > 0) {
      yPosition = addText(additionalSkills.join(', '), margin + 48, yPosition, pageWidth - margin - 50, 9.5, 1.2);
    }
  }
  yPosition += 8;

  // ============================================
  // PROFESSIONAL EXPERIENCE / PROJECTS
  // ============================================
  checkPageBreak(40);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
  yPosition += 6;

  pdf.setFontSize(9.5);
  
  // Job Title (derived from best role match)
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${bestRole[0]} Developer`, margin + 2, yPosition);
  yPosition += 5;
  
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(9);
  pdf.text('Open Source Contributions & Personal Projects', margin + 2, yPosition);
  yPosition += 6;

  // Resume bullets (achievements)
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  
  report.insights.resumeBullets.slice(0, 6).forEach(bullet => {
    if (checkPageBreak(15)) {
      // Add section header again if we're on a new page
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROFESSIONAL EXPERIENCE (continued)', margin, yPosition);
      yPosition += 8;
      pdf.setFontSize(9.5);
      pdf.setFont('helvetica', 'normal');
    }
    
    const cleanBullet = bullet.replace(/[•]/g, '').trim();
    yPosition = addText(`• ${cleanBullet}`, margin + 4, yPosition, pageWidth - 2 * margin - 4, 9.5, 1.3);
    yPosition += 2;
  });
  
  yPosition += 6;

  // ============================================
  // KEY PROJECTS
  // ============================================
  if (report.analysis.topRepos && report.analysis.topRepos.length > 0) {
    checkPageBreak(40);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('KEY PROJECTS', margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(9.5);
    
    report.analysis.topRepos.slice(0, 3).forEach((repo: any) => {
      if (checkPageBreak(20)) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('KEY PROJECTS (continued)', margin, yPosition);
        yPosition += 8;
        pdf.setFontSize(9.5);
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(repo.name, margin + 2, yPosition);
      
      if (repo.stars > 0) {
        pdf.setFont('helvetica', 'normal');
        pdf.text(`(${repo.stars} stars)`, margin + 2 + pdf.getTextWidth(repo.name) + 2, yPosition);
      }
      yPosition += 5;
      
      if (repo.description) {
        pdf.setFont('helvetica', 'normal');
        yPosition = addText(repo.description, margin + 4, yPosition, pageWidth - 2 * margin - 4, 9, 1.2);
      }
      
      if (repo.language) {
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(8.5);
        pdf.text(`Technologies: ${repo.language}`, margin + 4, yPosition);
        yPosition += 5;
        pdf.setFontSize(9.5);
      }
      
      yPosition += 3;
    });
    
    yPosition += 4;
  }

  // ============================================
  // ACHIEVEMENTS & METRICS
  // ============================================
  checkPageBreak(30);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ACHIEVEMENTS & METRICS', margin, yPosition);
  yPosition += 6;

  pdf.setFontSize(9.5);
  pdf.setFont('helvetica', 'normal');
  
  const achievements = [
    `Contributed to ${report.analysis.totalRepos} repositories with ${report.analysis.totalStars} total stars`,
    `Active developer with ${report.analysis.recentActivity} repositories updated in the last 6 months`,
    `ATS Resume Score: ${atsScore.total}/100 (Grade ${atsScore.grade})`,
    `${bestRole[1].matchPercentage}% role match for ${bestRole[0]} positions`
  ];
  
  achievements.forEach(achievement => {
    yPosition = addText(`• ${achievement}`, margin + 4, yPosition, pageWidth - 2 * margin - 4, 9.5, 1.3);
    yPosition += 2;
  });
  
  yPosition += 6;

  // ============================================
  // PROFESSIONAL DEVELOPMENT
  // ============================================
  if (report.insights.improvementRoadmap.length > 0) {
    checkPageBreak(35);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROFESSIONAL DEVELOPMENT GOALS', margin, yPosition);
    yPosition += 6;

    pdf.setFontSize(9.5);
    pdf.setFont('helvetica', 'normal');
    
    const goals = report.insights.improvementRoadmap
      .slice(0, 5)
      .map(item => item.replace(/[🎯📈⭐🚀🤝📚🌐]/g, '').trim());
    
    goals.forEach((goal) => {
      if (checkPageBreak(12)) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PROFESSIONAL DEVELOPMENT GOALS (continued)', margin, yPosition);
        yPosition += 8;
        pdf.setFontSize(9.5);
        pdf.setFont('helvetica', 'normal');
      }
      yPosition = addText(`• ${goal}`, margin + 4, yPosition, pageWidth - 2 * margin - 4, 9.5, 1.3);
      yPosition += 2;
    });
  }

  // ============================================
  // FOOTER
  // ============================================
  const pageCount = (pdf as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(120, 120, 120);
    
    drawLine(287, 0.3);
    pdf.text(`Generated by DevLens AI on ${new Date().toLocaleDateString()}`, pageWidth / 2, 292, { align: 'center' });
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, 292, { align: 'right' });
  }

  // Save the PDF
  const fileName = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
  pdf.save(fileName);
}

export async function generateProfileScreenshotPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  const pdf = new jsPDF('p', 'mm', 'a4');
  let position = 0;

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}