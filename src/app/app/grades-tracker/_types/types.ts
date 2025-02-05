import { gradeValueMap } from "../_constants/gradeValue";

export interface ICGPATrackerRow {
  courseCode: string;
  courseTitle: string;
  unitLoad: string;
  grade: keyof typeof gradeValueMap["OVER5"];
  gradePoint: string;
}

export interface ICGPATrackerPage {
  title: string;
  subTitle: string;
  rows: ICGPATrackerRow[];
  totalUnitLoad: string;
  totalGradePoint: string
  gradePointAverage: string;
  cummulativeGradePointAverage: string
  rowsToAdd: number;
  // cgpaScale?: TGradeScales
  imageUrl?: string;
}

export interface IGradesTrackerDocument {
  templateLayout?: "CLASSIC" | "MODERN";
  cgpaScale: TGradeScales
  filename: string;
  description?: string;
  currentPage?: number;
  pages?: ICGPATrackerPage[]
}

export interface ICGPATrackerConfig {
  cgpaScale: TGradeScales
}

export type TGradeTypes = "A"|"B"|"C"|"D"|"E"|"F";

export type TGradeScales = ("OVER4"|"OVER5")