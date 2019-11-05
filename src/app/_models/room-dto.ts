export interface RoomDTO {
  id: string;
  password: string;
  name: string;
  isPrivate: boolean;
  invoiceId: string;
  createdAt: Date;
  updatedAt?: Date;
}
