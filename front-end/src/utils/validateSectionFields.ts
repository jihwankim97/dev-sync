import type { ResumeSection } from "../types/resume.type";

// 섹션별 필수값
export const requiredFieldsMap: Record<ResumeSection["type"], string[]> = {
    profile: ["name", "email", "phoneNumber", "address"],
    skills: ["familiars", "strengths"],
    careers: ["items"],
    achievements: ["items"],
    project: ["name", "description", "startDate", "outcomes"],
    projects: ["items"],
    introduction: ["headline", "description"],
    custom: ["title", "description"],
};

// items 내부 필수값
export const itemRequiredFieldsMap: Partial<Record<ResumeSection["type"], string[]>> = {
    careers: ["company", "position", "startDate", "description"],
    achievements: ["title", "organization", "date"],
    projects: ["name", "description", "startDate", "outcomes"],
};

// outcomes 내부 필수값
export const outcomeRequiredFields = ["task", "result"];

// 공통 빈값 체크 함수
function isEmpty(value: any) {
    return (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
    );
}

// 필수값 검증 함수
export function validateRequiredFields(section: ResumeSection) {
    const fieldErrors: { [key: string]: boolean } = {};

    //섹션 자체 필수값 체크
    (requiredFieldsMap[section.type] || []).forEach((field) => {
        if (isEmpty(section[field as keyof typeof section])) {
            fieldErrors[field] = true;
        }
    });

    //items 내부 필수값 체크
    if ("items" in section && Array.isArray(section.items)) {
        const itemFields = itemRequiredFieldsMap[section.type] || [];
        section.items.forEach((item: any, idx: number) => {
            itemFields.forEach((field) => {
                if (isEmpty(item[field])) {
                    fieldErrors[`items_${idx}_${field}`] = true;
                }
            });
            // projects의 outcomes 배열 내부도 체크
            if (section.type === "projects" && Array.isArray(item.outcomes)) {
                item.outcomes.forEach((outcome: any, oIdx: number) => {
                    outcomeRequiredFields.forEach((field) => {
                        if (isEmpty(outcome[field])) {
                            fieldErrors[`items_${idx}_outcomes_${oIdx}_${field}`] = true;
                        }
                    });
                });
            }
        });
    }

    // 단일 project 섹션의 outcomes도 체크
    if ("outcomes" in section && Array.isArray(section.outcomes)) {
        section.outcomes.forEach((outcome: any, idx: number) => {
            outcomeRequiredFields.forEach((field) => {
                if (isEmpty(outcome[field])) {
                    fieldErrors[`outcomes_${idx}_${field}`] = true;
                }
            });
        });
    }

    return fieldErrors;
}