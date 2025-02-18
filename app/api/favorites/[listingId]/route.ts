import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
  listingId?: string;
}

export async function POST(
  request: Request,
  context: { params: IParams }
) {
  const { params } = context;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = await params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error('Invalid ID!');
  }

  let favoriteIds = [...(currentUser.favouriteIds || [])];

  favoriteIds.push(listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id
    },
    data: {
      favouriteIds: favoriteIds
    }
  });

  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  context: { params: IParams }
) {
  const { params } = context;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = await params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error('Invalid ID!');
  }

  let favoriteIds = [...(currentUser.favouriteIds || [])];

  favoriteIds = favoriteIds.filter((id) => id !== listingId);

  const user = await prisma.user.update({
    where: {
      id: currentUser.id
    },
    data: {
      favouriteIds: favoriteIds
    }
  });

  return NextResponse.json(user);
}