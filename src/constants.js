export const BASE_URL =
  "https://mohdimran001.github.io/lab-report-management-system/public/assets";

export const TEST_REPORT_URL = BASE_URL + "/reports/test-report.pdf";
export const FINAL_REPORT_URL = BASE_URL + "/reports/final-report.pdf";
export const STAMP_URL =  BASE_URL + "/images/stamp.png";
export const CACHE_NAME = "meditrust_app";

export const ALLOWED_EXTNS = /(\.jpg|\.jpeg)$/i;

export const EXCLUDED_FIELDS = [
  "photoName",
  "candidatePhoto",
  "fit",
  "reportCompleted",
  "id",
  "lab",
  "refrence",
  "updatedAt",
  "createdAt"
]

export const SEARCH_OPTIONS = {
    "Lab Sr No." : "labSrNo",
    "Examined Date": "dateExamined",
    "Expiry Date": "dateExpiry",
    "Full Name": "fullName",
    "Date of birth": "dob",
    "Passport": "passport",
};

export const REPORT_FIELDS = {
  // Candidate Information
  dateExamined:  '', // convertDate(dateExaminedRef.current.value),
  dateExpiry: '', // convertDate(dateExpiryRef.current.value),

  photoName: '', // unique name of photo
  candidatePhoto: '', // url of photo

  fullName: '',   // uppercase
  age: '',
  gender: '',
  height: '', // heightRef.current.value.length > 0 ? heightRef.current.value + " cm" : "",

  weight: '', // weightRef.current.value.length > 0 ? weightRef.current.value + " kg" : "",
  maritalStatus: '',
  dob: '', // convertDate(dobRef.current.value),
  doi: '', // convertDate(doiRef.current.value),

  nationality: '',
  passport: '', // uppercase
  poi: '',  
  post: '',
  
  // MEDICAL EXAMINATION
  // -> eyes
  visionRightEye: '',
  otherRightEye: 'NAD',
  visionLeftEye: '',
  otherLeftEye: 'NAD',
  
  // -> ears
  rightEar: 'NAD',
  leftEar: 'NAD',
  
  // -> systematic exam
  bloodPressure: '', // add mm Hg
  heart: '',
  lungs: '',
  abdomen: '',

  // -> venereal diseases (clinical)
  VDRLorTPHA: 'Non-Reactive',

  // -> chest x ray
  chest: 'NAD',

  // -> pregnancy
  pregnancy: 'Not Applicable', // map it to pregnancy state


  // LAB INVERSTIGATION

  // -> urine
  sugar: 'NIL',
  albumin: 'NIL',
  urineBilharziasis: 'NIL',
  urineOthers: '',

  // -> blood
  hemoglobin: '', // add gm %
  malariaFilm: 'Not Seen',
  microFilaria: 'Non-Reactive',
  bloodGroup: '',
  bloodOthers: '',

  // -> Stool
  helminths: 'Not Seen',
  stoolBilharziasis: 'Not Seen',
  salmonellaShigella: 'NAD',
  cholera: 'NAD',

  // -> serology 
  hiv: 'Non-Reactive',
  hbsag: 'Non-Reactive',
  antiHCV: 'Non-Reactive',
  lft: 'Normal',

  // -> serology (mg/dl)
  urea: '', 
  creatinine: '',
  bloodSugar: '',
  kft: 'Normal',

  // -> covid
  covid: '',

  // -> remarks
  fit: '',
  remarks: '',
  reportCompleted: false,
}