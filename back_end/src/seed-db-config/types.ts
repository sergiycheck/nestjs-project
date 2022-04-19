export type FakeUserFromFile = {
  id: number;
  uuid: string;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  email: string;
  ip: string;
  macAddress: string;
  website: string;
  image: string;
};

export type FakePostFromFile = {
  userId: string;
  id: string;
  title: string;
  body: string;
};
