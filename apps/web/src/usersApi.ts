import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type UserContact = {
  email: string;
  phoneNumber: string;
  fax?: string | null;
  linkedInUrl?: string | null;
};
export type UserAddress = {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};
export type School = {
  id?: string;
  schoolName: string;
  qualification?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
};
export type User = {
  id: string;
  profilePhotoUrl?: string | null;
  firstName: string;
  lastName: string;
  occupation: string;
  dob: string;
  gender: string;
  contact?: UserContact | null;
  address?: UserAddress | null;
  academics?: School[];
};
export type UsersPage = {
  items: User[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
export type UsersPageParams = { pageNumber: number; pageSize: number };
export type UserInfoPayload = {
  profilePhotoUrl?: string;
  firstName: string;
  lastName: string;
  dob: string;
  occupation: string;
  gender: string;
};
export type UserContactPayload = UserContact;
export type UserAddressPayload = UserAddress;
export type UserAcademicsPayload = { schools: School[] };
export type UserUpdatePayload = {
  userInfo?: Partial<UserInfoPayload>;
  userContact?: Partial<UserContactPayload>;
  userAddress?: Partial<UserAddressPayload>;
  userAcademics?: UserAcademicsPayload;
};

const userUrl = (id: string) => "/users/" + encodeURIComponent(id);

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<UsersPage, UsersPageParams>({
      query: ({ pageNumber, pageSize }) => ({
        url: "/users",
        params: { pageNumber, pageSize },
      }),
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, string>({
      query: (id) => userUrl(id),
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),
    createUserInfo: builder.mutation<User, UserInfoPayload>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: ["Users"],
    }),
    addUserContact: builder.mutation<
      User,
      { id: string; body: UserContactPayload }
    >({
      query: ({ id, body }) => ({
        url: userUrl(id) + "/contact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    addUserAddress: builder.mutation<
      User,
      { id: string; body: UserAddressPayload }
    >({
      query: ({ id, body }) => ({
        url: userUrl(id) + "/address",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    addUserAcademics: builder.mutation<
      User,
      { id: string; body: UserAcademicsPayload }
    >({
      query: ({ id, body }) => ({
        url: userUrl(id) + "/academics",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<User, { id: string; body: UserUpdatePayload }>(
      {
        query: ({ id, body }) => ({ url: userUrl(id), method: "PATCH", body }),
        invalidatesTags: ["Users"],
      },
    ),
    deleteUser: builder.mutation<{ deleted: boolean; id: string }, string>({
      query: (id) => ({ url: userUrl(id), method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserInfoMutation,
  useAddUserContactMutation,
  useAddUserAddressMutation,
  useAddUserAcademicsMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;

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
