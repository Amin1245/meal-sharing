
import { NextResponse } from 'next/server';

export async function GET() {

  return NextResponse.json({ status: 'ok', message: 'Application is healthy' }, { status: 200 });
}

//test//