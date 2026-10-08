import type { User } from "./usersApi";
import { isUserComplete } from "./userStatus";

const completeUser: User = {
  id: "user-1",
  firstName: "Ada",
  lastName: "Okafor",
  occupation: "Software Engineer",
  dob: "1994-06-15",
  gender: "FEMALE",
  contact: {
    email: "ada@example.com",
    phoneNumber: "+2348012345678",
  },
  address: {
    address: "12 Marina Road",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    zipCode: "101001",
  },
  academics: [{ schoolName: "University of Lagos" }],
};

describe("isUserComplete", () => {
  it("returns true when contact, address, and academic details are present", () => {
    expect(isUserComplete(completeUser)).toBe(true);
  });

  it("returns false when contact details are missing", () => {
    expect(isUserComplete({ ...completeUser, contact: null })).toBe(false);
  });

  it("returns false when a required address field is blank", () => {
    expect(
      isUserComplete({
        ...completeUser,
        address: { ...completeUser.address!, zipCode: "" },
      }),
    ).toBe(false);
  });

  it("returns false when the user has no academic records", () => {
    expect(isUserComplete({ ...completeUser, academics: [] })).toBe(false);
  });
});
