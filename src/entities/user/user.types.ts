export type Address = {
  id: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
};
