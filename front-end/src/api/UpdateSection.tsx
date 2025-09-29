import { ResumeSection } from "../types/resume.type";

export async function updateSectionAPI(section: ResumeSection, resumeId: string) {

    let sectionData: ResumeSection = section;


    let url = `http://localhost:3000/resumes/${resumeId}`;
    switch (section.type) {
        case "profile":
            url += "/profiles";
            break;
        case "skills":
            url += "/skills";
            break;
        case "projects":
            url += "/projects";
            break;
        case "introduction":
            url += "/introductions";
            break;
        case "careers":
            url += "/careers";
            break;
        case "achievements":
            url += "/achievements";
            break;
        case "custom":
            url += "/customs";
            break;

        default:
            throw new Error("Unknown section type");
    }

    try {
        console.log(sectionData, "보내는 데이터")
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(sectionData),
        });
        const updatedData = await response.json();
        if (!response.ok) {
            // 서버에서 에러 메시지 읽기
            const error = new Error("Validation failed");

            console.error("서버 에러 응답:", updatedData.validationErrors); // <- 여기서 backend JSON 확인 가능
            (error as any).validationErrors = updatedData.validationErrors;
            throw error;
        }


        return { ...section }; // 서버에서 받은 최신 데이터 포함
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("서버 에러 발생:", error);
        }
        throw error; // 필요하면 상위에서 또 catch 가능
    }
}