export interface roleTypes {
    role_id: number;
    role_name: string;
}


export interface RoleRequest extends Request {
    user?: {
      id: string;
      name: string;
      email: string;
      role_id: number;
      role_name: string;
      created_at?: Date;
      updated_at?: Date;
    };
  }
  