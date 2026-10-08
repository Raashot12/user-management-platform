import type { User } from "./usersApi";

export function isUserComplete(user: User): boolean {
  return Boolean(
    user.contact?.email &&
      user.contact.phoneNumber &&
      user.address?.address &&
      user.address.city &&
      user.address.state &&
      user.address.country &&
      user.address.zipCode &&
      user.academics?.length,
  );
}
