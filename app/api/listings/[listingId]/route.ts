import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function DELETE(request: NextRequest) {
  try {
    // Extract listingId from the request's URL
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Use delete instead of deleteMany for single deletion
    const listing = await prisma.listing.delete({
      where: {
        id: listingId,
        userId: currentUser.id,
      },
    });

    return NextResponse.json({
      message: "Listing deleted successfully",
      listing,
    });
  } catch (error) {
    console.error("Error in DELETE /listing:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
