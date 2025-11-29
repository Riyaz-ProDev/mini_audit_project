import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const versions = store.getVersions();
  return NextResponse.json(versions, { status: 200 });
}