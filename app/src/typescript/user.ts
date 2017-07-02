import { UserAccess } from "./user_access";
export class User {
  user_id: number = 0;
  user_type_id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  status: number = 1;
  password: string = '';
  user_access_projects: UserAccess[];
  user_access_languages: UserAccess[];
}
