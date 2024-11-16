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
  // gpaScale: TGradeScales
  rowsToAdd: number;
  imageUrl?: string;
}

export type TGradeTypes = "A"|"B"|"C"|"D"|"E"|"F";

export type TGradeScales = ("OVER4"|"OVER5")