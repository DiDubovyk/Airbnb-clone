import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";

interface IParams {
  listingId: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  try {
    // Directly access the listingId from params (no need for URL parsing)
    const listingId = params.listingId;

    if (!listingId) {
      return (
        <ClientOnly>
          <EmptyState />
        </ClientOnly>
      );
    }

    // Fetch data
   const [listing, reservations, currentUser] = await Promise.all([
     getListingById({ listingId }),
     getReservations({ listingId }),
     getCurrentUser(),
   ]);

    // Handle missing listing
    if (!listing) {
      return (
        <ClientOnly>
          <EmptyState />
        </ClientOnly>
      );
    }

    // Render the listing client component
    return (
      <ClientOnly>
        <ListingClient
          listing={listing}
          reservations={reservations}
          currentUser={currentUser}
        />
      </ClientOnly>
    );
  } catch (error) {
    console.error("Error fetching listing data:", error);
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }
};

export default ListingPage;
