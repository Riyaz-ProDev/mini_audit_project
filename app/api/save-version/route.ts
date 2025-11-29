import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nextText: string = (body?.text ?? "").toString();

    if (typeof nextText !== "string") {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }

    const entry = store.saveVersion(nextText);
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save version" }, { status: 500 });
  }
}