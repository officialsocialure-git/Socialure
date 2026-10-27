import { NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const ffmpeg = "C:\\Users\\hp\\AppData\\Local\\Programs\\Python\\Python313\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe";
  const movPath = path.join(process.cwd(), "public", "IMG_5622.MOV");

  let info = "";
  try {
    // ffmpeg -i outputs file info to stderr
    execSync(`"${ffmpeg}" -i "${movPath}"`, { encoding: "utf8" });
  } catch (e) {
    info = e.stderr || e.stdout || e.message;
  }

  return NextResponse.json({ info });
}
