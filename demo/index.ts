import { Faker, faker } from "@faker-js/faker";

export const makeArrayData = <T = unknown>(func: () => T) =>
  faker.helpers.multiple(func, { count: 10 });

export const makeArrayDataWithLength = <T = unknown>(
  func: (faker: Faker) => T,
  length: number
) => faker.helpers.multiple(() => func(faker), { count: length });


