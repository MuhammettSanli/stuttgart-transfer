import { setRequestLocale } from 'next-intl/server';
import { isAdminAuthed } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LoginForm } from '@/components/admin/LoginForm';
import { BookingsTable, type AdminBooking } from '@/components/admin/BookingsTable';

// Admin bookings are dynamic and must never be cached/prerendered.
export const dynamic = 'force-dynamic';

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  if (!isAdminAuthed()) {
    return (
      <div className="container-page py-16">
        <LoginForm />
      </div>
    );
  }

  const rows = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { vehicle: { select: { name: true } } },
  });

  const bookings: AdminBooking[] = rows.map((b) => ({
    id: b.id,
    status: b.status,
    locale: b.locale,
    firstName: b.firstName,
    lastName: b.lastName,
    email: b.email,
    phone: b.phone,
    pickupAddress: b.pickupAddress,
    dropoffAddress: b.dropoffAddress,
    pickupAt: b.pickupAt.toISOString(),
    passengers: b.passengers,
    luggage: b.luggage,
    vehicleName: b.vehicle.name,
    priceCents: b.priceCents,
  }));

  return (
    <div className="container-page py-12">
      <BookingsTable bookings={bookings} />
    </div>
  );
}
