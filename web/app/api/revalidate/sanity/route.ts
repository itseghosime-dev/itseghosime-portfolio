import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Sanity revalidation is not configured." },
      { status: 503 },
    );
  }

  try {
    const { body, isValidSignature } = await parseBody(request, secret, true);

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 401 },
      );
    }

    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/feed.xml");

    return NextResponse.json({
      revalidated: true,
      type:
        body && typeof body === "object" && "_type" in body
          ? body._type
          : undefined,
    });
  } catch (error) {
    console.error("Sanity revalidation failed:", error);
    return NextResponse.json(
      { error: "Unable to revalidate content." },
      { status: 500 },
    );
  }
}
