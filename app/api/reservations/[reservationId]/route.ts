import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function DELETE(request: NextRequest) {
  try {
    // Extract reservationId from the URL (from params or searchParams)
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get("reservationId");

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!reservationId || typeof reservationId !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const reservation = await prisma.reservation.deleteMany({
      where: {
        id: reservationId,
        OR: [
          { userId: currentUser.id },
          { listing: { userId: currentUser.id } },
        ],
      },
    });

    return NextResponse.json({
      message: "Reservation deleted successfully",
      reservation,
    });
  } catch (error) {
    console.error("Error in DELETE /reservation:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
