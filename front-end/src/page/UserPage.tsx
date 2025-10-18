import { css } from "@emotion/react";
import dayjs from "dayjs";
import {
  memo,
  useEffect,
  useReducer,
  useState,
  useCallback,
  Suspense,
  type ChangeEventHandler,
} from "react";

import type { userInfo } from "../types/resume.type";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Avatar, InputAdornment, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userKeys } from "../api/queryKeys";
import { ENDPOINTS } from "../api/endpoint";
import { request } from "../api/queries/baseQuery";

// 공통 스타일 정의
const containerStyle = css`
  padding: 4rem 8rem 3rem 8rem;
  display: flex;
  background-color: #ffffffff;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 2rem;
    border: 2px solid red;
  }
`;

// 공통 버튼 스타일
const dsButtonStyle = css`
  background: #3369c7;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(51, 105, 199, 0.08);
  transition: background 0.2s;
  &:hover {
    background: #254e8e;
  }
  @media (max-width: 700px) {
    font-size: 0.85rem;
    padding: 0.35rem 0.7rem;
    min-width: 70px;
    font-weight: 400;
  }
`;

const sectionStyle = css`
  border-radius: 0.5rem;
  background-color: #fdfdfdff;
  flex-grow: 1;
  padding: 1.4rem;
  border: 0.5px solid #e0e0e0;
  width: 60%;
  @media (max-width: 768px) {
    width: 95%;
    padding: 0.8rem;
  }
`;

const headerStyle = css`
  width: 40%;
  font-size: 1.5rem;
  font-weight: bold;
  color: #313131ff;
`;

const buttonGroupStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;

  button {
    @media (max-width: 700px) {
      font-size: 0.85rem;
      padding: 0.35rem 0.7rem;
      min-width: 70px;
    }
  }
`;

const labelStyle = css`
  font-weight: bold;
  margin: 1rem;
  flex-direction: column; /* 수직 정렬 */
  align-items: flex-start; /* 왼쪽 정렬 */
  display: flex;
  width: 100%;
`;

const LongLabelStyle = css`
  font-weight: bold;
  margin: 1rem;
  width: 100%;
`;

const customTextFieldStyle = css`
  background-color: #ffffffff;
  width: 73%;
`;

const flexRowStyle = css`
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const longTextFieldStyle = css`
  background-color: #ffffffff;
  width: 88.5%;
`;

const dividerStyle = css`
  width: 80%;
  margin: auto;
  border: none;
  border-top: 1.5px solid #e0e0e0;
`;

export const InfoAlert = memo(({ message }: { message: string }) => (
  <div
    css={css`
      background: #e3f7e3;
      color: #348638ff;
      border-radius: 4px;
      padding: 0.7rem 1rem;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    `}
  >
    {message}
  </div>
));

const initialState: userInfo = {
  id: 0,
  createdDt: "",
  name: "",
  email: "",
  githubUrl: "",
  blogUrl: "",
  profileImage: "",
  universityName: "",
  departmentName: "",
  educationLevel: "",
  birthDate: "",
  phoneNumber: "1012345678",
};

// CustomTextField 컴포넌트
interface CustomTextProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
}

export const CustomTextField = ({
  label,
  value,
  onChange,
}: CustomTextProps) => (
  <TextField
    placeholder={label}
    variant="outlined"
    error={!value}
    value={value || ""}
    onChange={(e) => onChange(e.target.value)} // 입력값 변경 처리
    css={customTextFieldStyle}
  />
);

function reducer(
  state: userInfo,
  action:
    | { type: "SET_FIELD"; field: keyof userInfo; value: string | number }
    | { type: "SET_ALL"; payload: Partial<userInfo> }
) {
  switch (action.type) {
    case "SET_ALL":
      return { ...state, ...action.payload };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
  }
}

// Profile Section 컴포넌트
const ProfileSection = memo(
  ({
    previewImage,
    handlePreviewChange,
    updateProfileImage,
    alertUpdate,
  }: {
    previewImage: string;
    handlePreviewChange: ChangeEventHandler<HTMLInputElement>;
    updateProfileImage: () => void;
    alertUpdate: { type: string; open: boolean };
  }) => (
    <div css={containerStyle}>
      <div css={headerStyle}>Profile</div>
      <div css={sectionStyle}>
        {alertUpdate.type === "profile" && (
          <InfoAlert message="프로필이 업데이트 되었습니다." />
        )}
        <div css={labelStyle}>Image</div>
        <div
          css={css`
            margin-left: 0.5rem;
            display: flex;
          `}
        >
          <Avatar
            alt="User Profile"
            src={previewImage}
            sx={{ width: 75, height: 75 }}
          />
          <input
            id="fileInput"
            css={css`
              display: none;
            `}
            type="file"
            onChange={handlePreviewChange}
          />
          <button
            css={dsButtonStyle}
            style={{ margin: "1.5rem" }}
            onClick={() => document.getElementById("fileInput")!.click()}
          >
            파일 선택
          </button>
        </div>
        <div css={buttonGroupStyle}>
          <button css={dsButtonStyle} onClick={updateProfileImage}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
);

// Account Section 컴포넌트
const AccountSection = memo(
  ({
    userData,
    changeValue,
    handleSave,
    alertUpdate,
  }: {
    userData: userInfo;
    changeValue: (section: keyof userInfo, data: string | number) => void;
    handleSave: { mutate: () => void };
    alertUpdate: { type: string; open: boolean };
  }) => (
    <div css={containerStyle}>
      <div css={headerStyle}>Account Information</div>
      <div css={sectionStyle}>
        {alertUpdate.type === "user" && (
          <InfoAlert message="유저 정보가 업데이트 되었습니다." />
        )}
        <div css={flexRowStyle}>
          <div css={labelStyle}>
            Name
            <CustomTextField
              label="Username"
              value={userData.name}
              onChange={(value) => changeValue("name", value)}
            />
          </div>
          <div css={labelStyle}>
            E-mail
            <CustomTextField
              label="E-mail"
              value={userData.email}
              onChange={(value) => changeValue("email", value)}
            />
          </div>
        </div>
        <div css={flexRowStyle}>
          <div css={labelStyle}>
            GitHub
            <CustomTextField
              label="github.com/"
              value={userData.githubUrl}
              onChange={(value) => changeValue("githubUrl", value)}
            />
          </div>
          <div css={labelStyle}>
            Blog
            <CustomTextField
              label="Blog"
              value={userData.blogUrl}
              onChange={(value) => changeValue("blogUrl", value)}
            />
          </div>
        </div>
        <div css={flexRowStyle}>
          <div css={labelStyle}>
            BirthDay
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={userData.birthDate ? dayjs(userData.birthDate) : null}
                onChange={(newValue) => {
                  if (newValue) {
                    const formattedDate = newValue.format("YYYY-MM-DD");
                    changeValue("birthDate", formattedDate);
                  } else {
                    changeValue("birthDate", "");
                  }
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div
          css={css`
            display: flex;
            flex-wrap: wrap;
          `}
        >
          <div css={LongLabelStyle}>
            Phone Number
            <TextField
              placeholder="01012341234"
              variant="outlined"
              error={!userData.phoneNumber}
              css={longTextFieldStyle}
              value={userData.phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                changeValue("phoneNumber", Number(e.target.value))
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">+82 |</InputAdornment>
                  ),
                },
              }}
            />
          </div>
        </div>
        <div css={buttonGroupStyle}>
          <button css={dsButtonStyle} onClick={() => handleSave.mutate()}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
);

// Career Section 컴포넌트
const CareerSection = memo(
  ({
    userData,
    changeValue,
    handleSave,
    alertUpdate,
  }: {
    userData: userInfo;
    changeValue: (section: keyof userInfo, data: string | number) => void;
    handleSave: { mutate: () => void };
    alertUpdate: { type: string; open: boolean };
  }) => (
    <div css={containerStyle}>
      <div css={headerStyle}>Career Information</div>
      <div css={sectionStyle}>
        {alertUpdate.type === "user" && (
          <InfoAlert message="정보가 업데이트 되었습니다." />
        )}
        <div
          css={css`
            display: flex;
            flex-direction: column;
            width: 100%;
          `}
        >
          <div css={labelStyle}>
            Education
            <select
              css={css`
                width: 45%;
                padding: 1rem;
                border-radius: 4px;
                border: 1px solid #ccc;
                background: #ffffffff;
                font-size: 1rem;
              `}
              value={userData.educationLevel || ""}
              onChange={(e) => changeValue("educationLevel", e.target.value)}
            >
              <option value="" disabled>
                학력 구분 선택
              </option>
              <option value="초등학교 졸업">초등학교 졸업</option>
              <option value="중학교 졸업">중학교 졸업</option>
              <option value="고등학교 졸업">고등학교 졸업</option>
              <option value="대학교대학원 이상 졸업">
                대학교·대학원 이상 졸업
              </option>
            </select>
          </div>
          {userData.educationLevel === "대학교대학원 이상 졸업" && (
            <>
              <div css={labelStyle}>
                Univ
                <input
                  type="text"
                  placeholder="학교명을 입력하세요"
                  value={userData.universityName}
                  css={css`
                    width: 45%;
                    padding: 0.5rem;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    background: #f9f9f9;
                    font-size: 1rem;
                  `}
                  onChange={(e) =>
                    changeValue("universityName", e.target.value)
                  }
                />
              </div>
              <div css={labelStyle}>
                Major
                <input
                  type="text"
                  placeholder="학과명을 입력하세요"
                  value={userData.departmentName}
                  css={css`
                    width: 45%;
                    padding: 0.5rem;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    background: #f9f9f9;
                    font-size: 1rem;
                  `}
                  onChange={(e) =>
                    changeValue("departmentName", e.target.value)
                  }
                />
              </div>
            </>
          )}
        </div>
        <div css={buttonGroupStyle}>
          <button css={dsButtonStyle} onClick={() => handleSave.mutate()}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
);

// UserPage 컴포넌트
export const UserPage = () => {
  const [userData, setUserData] = useReducer(reducer, initialState);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState(
    userData?.profileImage || ""
  );
  const [alertUpdate, setAlertUpdate] = useState<{
    type: string;
    open: boolean;
  }>({ type: "", open: false });

  const { data, isError, refetch } = useQuery<userInfo>({
    queryKey: [userKeys.user],
    queryFn: () => request({ url: ENDPOINTS.user() }),
  });

  useEffect(() => {
    console.log(data);
    if (data) {
      setUserData({ type: "SET_ALL", payload: data });
    }
  }, [data]);

  const handlePreviewChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
        setSelectedFile(file);
      }
    },
    []
  );

  const updateProfileMutation = useMutation({
    mutationFn: useCallback((selectedFile: File) => {
      const formData = new FormData();
      formData.append("file", selectedFile);
      return request({
        method: "POST",
        url: ENDPOINTS.userId("profile"),
        body: formData,
      });
    }, []),
    onSuccess: () => {
      setAlertUpdate({ type: "profile", open: true });
      refetch();
    },
    onError: (error: any) => {
      console.error("Profile image update failed:", error);
    },
  });

  const updateProfileImage = useCallback(() => {
    if (!selectedFile) {
      console.error("파일을 선택하세요.");
      return;
    }
    updateProfileMutation.mutate(selectedFile);
  }, [selectedFile, updateProfileMutation]);

  const handleSave = useMutation({
    mutationFn: useCallback(() => {
      const {
        id: _user_id,
        profileImage: _profileImage,
        createdDt: _createdDt,
        ...rest
      } = userData;
      return request({ method: "POST", url: ENDPOINTS.user(), body: rest });
    }, [userData]),
    onSuccess: useCallback(() => {
      setAlertUpdate({ type: "user", open: true });
      refetch();
    }, [refetch]),
    onError: useCallback((error: any) => {
      console.error("Update failed:", error);
    }, []),
  });

  useEffect(() => {
    if (userData?.profileImage) {
      setPreviewImage(userData.profileImage);
    }
  }, [userData?.profileImage]);

  const changeValue = useCallback(
    (section: keyof userInfo, data: string | number) => {
      setUserData({ type: "SET_FIELD", field: section, value: data });
    },
    []
  );

  // Suspense로 데이터 로딩 처리
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isError ? (
        <div>
          <div>유저 정보를 불러오지 못했습니다.</div>
          <button onClick={() => refetch()}>다시 시도</button>
        </div>
      ) : (
        <>
          <ProfileSection
            previewImage={previewImage}
            handlePreviewChange={handlePreviewChange}
            updateProfileImage={updateProfileImage}
            alertUpdate={alertUpdate}
          />
          <hr css={dividerStyle} />
          <AccountSection
            userData={userData}
            changeValue={changeValue}
            handleSave={handleSave}
            alertUpdate={alertUpdate}
          />
          <hr css={dividerStyle} />
          <CareerSection
            userData={userData}
            changeValue={changeValue}
            handleSave={handleSave}
            alertUpdate={alertUpdate}
          />
        </>
      )}
    </Suspense>
  );
};
