import { NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function GET() {
  const ffmpeg = "C:\\Users\\hp\\AppData\\Local\\Programs\\Python\\Python313\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe";
  const publicDir = path.join(process.cwd(), "public");
  const movPath = path.join(publicDir, "IMG_5622.MOV");
  const mp4Path = path.join(publicDir, "IMG_5622.mp4");

  if (!fs.existsSync(movPath)) {
    return NextResponse.json({ error: "MOV file not found" });
  }

  try {
    // Convert HEVC MOV to web-compatible H.264 MP4 with faststart
    const cmd = `"${ffmpeg}" -y -i "${movPath}" -c:v libx264 -pix_fmt yuv420p -preset veryfast -crf 22 -c:a aac -b:a 128k -movflags +faststart "${mp4Path}"`;
    execSync(cmd, { encoding: "utf8", timeout: 120000 });
    
    const mp4Stat = fs.statSync(mp4Path);
    return NextResponse.json({ success: true, mp4Size: mp4Stat.size, path: mp4Path });
  } catch (e) {
    return NextResponse.json({ error: e.message, stderr: e.stderr });
  }
}
