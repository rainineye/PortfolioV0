/**
 * /office — The main pixel office page.
 *
 * Server-side: validates gate cookie; redirects to / if not authenticated.
 * Client-side: renders the OfficeScene.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OfficeScene } from "@/app/components/OfficeScene";

export const dynamic = "force-dynamic";

export default async function OfficePage() {
  const cookieStore = await cookies();
  const gate = cookieStore.get("pixel-office-gate")?.value;

  if (gate !== "authenticated") {
    redirect("/");
  }

  return <OfficeScene />;
}
