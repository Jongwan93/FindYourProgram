import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

let programDataCache = null;

function loadProgramData() {
  if (programDataCache) return programDataCache;
  try {
    const filePath = path.join(process.cwd(), 'data', 'programs.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    programDataCache = jsonData;
    console.log("Excel data loaded and cached successfully.");
    return programDataCache;
  } catch (error) {
    console.error("Error reading or parsing Excel file:", error);
    throw new Error("Could not load program data.");
  }
}

export const runtime = 'nodejs';

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Program ID is required." },
        { status: 400 }
      );
    }

    const allPrograms = loadProgramData();

    // Decode the ID (it might be URL-encoded)
    const decodedId = decodeURIComponent(id);

    // Search for the program by course code (most reliable) or program name
    const program = allPrograms.find(p => {
      const courseCode = p['course code'] || '';
      const programName = p['full course name'] || '';

      // Try exact match on course code first (case-insensitive)
      if (courseCode && courseCode.toLowerCase() === decodedId.toLowerCase()) {
        return true;
      }

      // Fall back to program name matching (case-insensitive)
      if (programName && programName.toLowerCase() === decodedId.toLowerCase()) {
        return true;
      }

      return false;
    });

    if (!program) {
      return NextResponse.json(
        { message: "Program not found." },
        { status: 404 }
      );
    }

    // Normalize the program data structure
    const normalizedProgram = {
      courseCode: program['course code'] || '',
      programName: program['full course name'] || program.programName || '',
      degreeName: program['degree Name'] || program.degreeName || '',
      description: program['program description'] || program.description || '',
      areaOfStudy: program['area of study'] || program.areaOfStudy || '',
      prerequisites: program['pre requisite'] || program.prerequisites || '',
      websiteLink: program['website link to the course'] || program.websiteLink || '',
      universityName: program.universityName || 'University of Toronto',
      facultyName: program.facultyName || '',
      location: program.location || 'Ontario',
    };

    return NextResponse.json(normalizedProgram, { status: 200 });
  } catch (error) {
    console.error("API Error in /api/programs/[id]:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred." },
      { status: 500 }
    );
  }
}
