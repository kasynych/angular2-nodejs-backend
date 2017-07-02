import { ProjectLanguage } from './project_language';
export class Project{
  project_id:number = 0;
  project_name:string;
  platform:string;
  parameter1:string;
  parameter2:string;
  parameter3:string;
  parameter4:string;
  project_languages: ProjectLanguage[]
}