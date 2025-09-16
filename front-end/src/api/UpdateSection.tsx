import { ResumeSection } from "../types/resume.type";

export async function updateSectionAPI(section: ResumeSection) {
    let sectionData;
    if (["profile", "introduction"].includes(section.type)) {
        const { id, ...withoutId } = section;
        sectionData = withoutId
    }
    if (sectionData && sectionData.type === "profile") {
        const githubUrl = "https://github.com/" + sectionData.githubUrl;
        sectionData = { ...sectionData, githubUrl };

    }
    let url = `http://localhost:3000/resumes/${section.id}`;
    switch (section.type) {
        case "profile":
            url += "/profiles";
            break;
        case "skills":
            url += "/api/skills";
            break;
        case "projects":
            url += "/api/projects";
            break;
        default:
            throw new Error("Unknown section type");
    }

    try {
        console.log(sectionData)
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(sectionData),
        });

        if (!response.ok) {
            // 서버에서 에러 메시지 읽기
            // console.log(errorData)
        }

        const updatedData = await response.json();
        return { ...section, data: updatedData }; // 서버에서 받은 최신 데이터 포함
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("서버 에러 발생:", error);
        } else {
            console.error("알 수 없는 서버 에러:", error);
        }
        throw error; // 필요하면 상위에서 또 catch 가능
    }
}