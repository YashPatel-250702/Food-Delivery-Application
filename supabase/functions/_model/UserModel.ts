export interface User {
  id?: number;
  name: string;
  email: string;
  phoneNo: string;
  password: string;
  address: string;
  userRole: string;
  createdAt: Date;
  updatedAt: Date;
}
