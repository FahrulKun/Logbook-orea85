import { NextRequest, NextResponse } from 'next/server';

interface LogEntry {
  id: string;
  date: string;
  day: number;
  treatmentName: string;
  commission: number;
}

// Simulate database storage with in-memory storage
let logs: LogEntry[] = [];

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    logs = logs.filter(log => log.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Log deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete log' },
      { status: 500 }
    );
  }
}