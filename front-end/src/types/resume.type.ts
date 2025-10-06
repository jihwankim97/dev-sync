// ? 는 필수값아님
//order에서 하나씩있는건  type string ,  커스텀만 type에  uuid custom/uuid
// 아마 id, type 둘중 하나 사라짐 일단 아이디 없어짐 , 묶어주는것들만 그렇게 ,
// 블록내부의 items 애들은 id, type 들어감

export type ResumeData = {
  id: string;
  title: string;
  order: string[];
  entities: ResumeSection[];
};

export type ResumeSection =
  | ProfileTypeSection
  | SkillsTypeSection
  | CareersTypeSection
  | AchievementsTypeSection
  | ProjectTypeSection
  | IntroductionTypeSection
  | CustomTypeSection
  | ProjectsTypeSection;

export type ProfileTypeSection = {
  id: string;
  type: "profile";
  name: string;
  email: string;
  githubUrl?: string;
  blogUrl?: string;
  phoneNumber: string;
  address: string;
  education?: string;
};

export type userInfo = {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  profileImage: string;
  createdDt: string;
  githubUrl: string;
  blogUrl: string;
  universityName: string;
  departmentName: string;
  educationLevel: string;
  birthDate: string;
};

export type SkillInnerType = {
  id: number;
  name: string;
  icon: string;
};

export type SkillsTypeSection = {
  id: string;
  type: "skills";
  familiars: SkillInnerType[];
  strengths: SkillInnerType[];
};

export type CareersTypeSection = {
  id: string;
  type: "careers";
  items: CareerItem[];
};

export type CareerItem = {
  id: string;
  // type: "career";
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  // isCurrent: boolean;
  description: string;
};

export type AchievementsTypeSection = {
  id: string;
  type: "achievements";
  items: AchievementItem[];
};

export type AchievementItem = {
  id: string;
  title: string;
  organization: string;
  date: string;
  description?: string;
};

export type ProjectTypeSection = {
  id: string;
  type: "project";
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  outcomes: OutcomeTypeSection[];
};

export type ProjectsTypeSection = {
  id: string;
  type: "projects";
  items: ProjectTypeSection[];
};

export type OutcomeTypeSection = {
  id: string;
  task: string;
  result: string;
};

export type IntroductionTypeSection = {
  id: string;
  type: "introduction";
  headline: string;
  description: string;
};

export type CustomTypeSection = {
  id: string;
  type: "custom";
  title: string;
  description: string;
};
