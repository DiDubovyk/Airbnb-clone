import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: NextRequest) {
  try {
    // Extract listingId from the request URL (instead of using params)
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Avoid duplicates in favoriteIds
    const favoriteIds = new Set(currentUser.favoriteIds || []);
    favoriteIds.add(listingId);

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: { favoriteIds: Array.from(favoriteIds) }, // Convert Set back to array
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in POST /favorites:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Extract listingId from the request URL
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove the listingId from favorites
    const favoriteIds = (currentUser.favoriteIds || []).filter(
      (id) => id !== listingId
    );

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: { favoriteIds },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in DELETE /favorites:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
