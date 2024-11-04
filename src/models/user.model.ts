// models/User.ts
import mongoose, { Schema, Document, model, models } from 'mongoose';

export type TModules = "FINANCE_TRACKER" | "INVOICE_GENERATOR";

export interface IUserModel {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  modules: {
    [key in TModules]?: {
      preferences: Record<string, unknown>;
    }
  };
  createdAt: Date;
  updatedAt: Date;
}

export type IUserModelDocument = IUserModel & Document;

const UserSchema = new Schema<IUserModelDocument>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  verified_email: { type: Boolean, required: true },
  name: { type: String, required: true },
  given_name: { type: String, required: true },
  family_name: { type: String, required: true },
  picture: { type: String, required: true },
  modules: {
    FINANCE_TRACKER: { preferences: { type: Schema.Types.Mixed, default: {} } },
    INVOICE_GENERATOR: { preferences: { type: Schema.Types.Mixed, default: {} } },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = models.User || model<IUserModelDocument>('User', UserSchema);

export default UserModel;
