import { Semester, Course, calculateGPA, calculateCGPA } from "./storage";

// Export CGPA data as CSV
export const exportToCSV = (semesters: Semester[], cgpa: number): void => {
  let csv = "Semester,Course Name,Credits,Grade,GPA Points\n";
  
  semesters.forEach((sem) => {
    sem.courses.forEach((course) => {
      const gradePoints = getGradePoints(course.grade);
      csv += `"${sem.name}","${course.name}",${course.credits},${course.grade},${gradePoints}\n`;
    });
    
    // Add semester summary
    const semGPA = calculateGPA(sem.courses);
    csv += `"${sem.name} Summary","","","GPA",${semGPA.toFixed(2)}\n`;
    csv += "\n";
  });
  
  // Add overall CGPA
  csv += `"Overall CGPA","","","",${cgpa.toFixed(2)}\n`;
  
  downloadFile(csv, "cgpa-data.csv", "text/csv");
};

// Export CGPA data as JSON
export const exportToJSON = (semesters: Semester[], cgpa: number): void => {
  const data = {
    exportDate: new Date().toISOString(),
    cgpa: parseFloat(cgpa.toFixed(2)),
    semesters: semesters.map((sem) => ({
      name: sem.name,
      gpa: parseFloat(calculateGPA(sem.courses).toFixed(2)),
      courses: sem.courses,
    })),
  };
  
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, "cgpa-data.json", "application/json");
};

// Generate PDF-like text format (can be printed to PDF)
export const exportToPDF = (semesters: Semester[], cgpa: number, userName: string): void => {
  let content = `
═══════════════════════════════════════════════════════════
                    ACADEMIC TRANSCRIPT
═══════════════════════════════════════════════════════════

Student: ${userName}
Generated: ${new Date().toLocaleDateString()}
Cumulative GPA: ${cgpa.toFixed(2)} / 4.00

═══════════════════════════════════════════════════════════

`;

  semesters.forEach((sem, idx) => {
    const semGPA = calculateGPA(sem.courses);
    content += `\n${idx + 1}. ${sem.name.toUpperCase()}\n`;
    content += `${"─".repeat(63)}\n`;
    content += `${"Course Name".padEnd(35)} ${"Credits".padEnd(10)} ${"Grade".padEnd(10)} Points\n`;
    content += `${"─".repeat(63)}\n`;
    
    sem.courses.forEach((course) => {
      const gradePoints = getGradePoints(course.grade);
      const points = (gradePoints * course.credits).toFixed(2);
      content += `${course.name.padEnd(35)} ${course.credits.toString().padEnd(10)} ${course.grade.padEnd(10)} ${points}\n`;
    });
    
    content += `${"─".repeat(63)}\n`;
    content += `Semester GPA: ${semGPA.toFixed(2)}\n\n`;
  });

  content += `\n${"═".repeat(63)}\n`;
  content += `CUMULATIVE GPA: ${cgpa.toFixed(2)} / 4.00\n`;
  content += `${"═".repeat(63)}\n`;

  downloadFile(content, "cgpa-transcript.txt", "text/plain");
};

// Helper function to get grade points
const getGradePoints = (grade: string): number => {
  const gradeMap: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "D-": 0.7,
    "F": 0.0,
  };
  return gradeMap[grade] || 0;
};

// Helper function to trigger download
const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
