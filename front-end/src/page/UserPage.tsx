import { css } from "@emotion/react";
import {
  Alert,
  Collapse,
  Divider,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import {
  useEffect,
  useReducer,
  useState,
  type ChangeEventHandler,
} from "react";
import { fetchUserInfo } from "../api/UserApi";
import type { userInfo } from "../types/resume.type";

const initialState: userInfo = {
  user_id: 0,
  createdDt: "",
  name: "",
  email: "",
  githubUrl: "",
  blogUrl: "",
  profile_image: "",
  universityName: "",
  departmentName: "",
  educationLevel: "",
  birthDate: "s",
  phone_number: 1012345678,
};

// 공통 스타일 정의
const containerStyle = css`
  padding: 4rem 8rem 3rem 8rem;
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const sectionStyle = css`
  border-radius: 0.5rem;
  background-color: #ffffff;
  flex-grow: 1;
  padding: 1.4rem;
  box-shadow: 0px 1px 3px rgba(134, 134, 134, 0.2);
  width: 60%;
`;

const headerStyle = css`
  width: 40%;
  font-size: 1.4rem;
  font-weight: bold;
`;

const buttonGroupStyle = css`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
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
  background-color: #f9f9f9;
  width: 75%;
`;

const longTextFieldStyle = css`
  background-color: #f9f9f9;
  width: 88.5%;
`;

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
    size="small"
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

// UserPage 컴포넌트
export const UserPage = () => {
  const [userData, setUserData] = useReducer(reducer, initialState);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined); // 선택된 파일 상태
  const [previewImage, setPreviewImage] = useState(
    userData?.profile_image || ""
  );
  const [alertUpdate, setAlertUpdate] = useState<{
    type: string;
    open: boolean;
  }>({ type: "", open: false });

  console.log(userData);
  useEffect(() => {
    fetchUserInfo()
      .then((data) => {
        setUserData({ type: "SET_ALL", payload: data });
      })
      .catch((err) => {
        console.log(err.message || "알 수 없는 에러");
        // setLoading(false);
      });
  }, []);

  const handlePreviewChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // 선택한 파일로부터 URL 생성
      setPreviewImage(imageUrl); // 미리보기 이미지 설정
      setSelectedFile(file);
    }
  };

  const updateProfileImage = async () => {
    if (!selectedFile) {
      console.error("파일을 선택하세요.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile); // 선택된 파일 추가

    try {
      const response = await fetch("http://localhost:3000/user/profile", {
        method: "POST",
        body: formData,
        credentials: "include", // 세션 쿠키 포함
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Profile image update success:", result);
        // setAlertProfile(true);
        setAlertUpdate({ type: "profile", open: true });
        // dispatch(login(result));
      } else {
        const error = await response.json();
        console.error("Profile image update failed:", error.message || error);
      }
    } catch (error) {
      console.error("Error during profile update:", error);
    }
  };

  const handleSave = async () => {
    const {
      user_id: _user_id,
      profile_image: _profile_image,
      createdDt: _createdDt,
      ...rest
    } = userData;
    const response = await fetch("http://localhost:3000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include", // 세션 쿠키 포함

      body: JSON.stringify(rest),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      setAlertUpdate({ type: "user", open: true });
    } else {
      const error = await response.json();
      console.error("Update failed:", error, response);
    }
  };

  useEffect(() => {
    if (userData?.profile_image) {
      setPreviewImage(userData.profile_image);
    }
  }, [userData?.profile_image]);

  const changeValue = (section: keyof userInfo, data: string | number) => {
    setUserData({ type: "SET_FIELD", field: section, value: data });
  };

  return (
    <>
      <div css={containerStyle}>
        <div css={headerStyle}>Profile</div>
        <div css={sectionStyle}>
          <Collapse in={alertUpdate.type === "profile"}>
            <Alert severity="success">프로필이 업데이트 되었습니다.</Alert>
          </Collapse>
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
            <Button
              css={css`
                margin: 1.5rem;
              `}
              size="small"
              variant="contained"
              onClick={() => document.getElementById("fileInput")!.click()}
            >
              파일 선택
            </Button>
          </div>
          <div css={buttonGroupStyle}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={updateProfileImage}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <Divider
        css={css`
          width: 80%;
          margin: auto;
        `}
      />
      <div css={containerStyle}>
        <div css={headerStyle}>Account Information</div>
        <div css={sectionStyle}>
          <Collapse in={alertUpdate.type === "user"}>
            <Alert severity="success">유저 정보가 업데이트 되었습니다.</Alert>
          </Collapse>
          <div
            css={css`
              display: flex;
            `}
          >
            <div css={labelStyle}>
              Name
              <CustomTextField
                label="Username"
                value={userData.name}
                onChange={(value) => {
                  changeValue("name", value);
                }}
              />
            </div>
            <div css={labelStyle}>
              E-mail
              <CustomTextField
                label="E-mail"
                value={userData.email}
                onChange={(value) => {
                  changeValue("email", value);
                }}
              />
            </div>
          </div>
          <div
            css={css`
              display: flex;
            `}
          >
            <div css={labelStyle}>
              GitHub
              <CustomTextField
                label="github.com/"
                value={userData.githubUrl}
                onChange={(value) => {
                  changeValue("githubUrl", value);
                }}
              />
            </div>
            <div css={labelStyle}>
              Blog
              <CustomTextField
                label="Blog"
                value={userData.blogUrl}
                onChange={(value) => {
                  changeValue("blogUrl", value);
                }}
              />
            </div>
          </div>{" "}
          <div
            css={css`
              display: flex;
            `}
          >
            <div css={labelStyle}>
              BirthDay
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={userData.birthDate ? dayjs(userData.birthDate) : null}
                  onChange={(newValue) => {
                    if (newValue) {
                      const formattedDate = newValue.format("YYYY-MM-DD");
                      // setBirthDate(formattedDate); // 상태 업데이트
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
                size="small"
                error={!userData.phone_number}
                css={longTextFieldStyle}
                value={userData.phone_number}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  changeValue("phone_number", Number(e.target.value));
                }}
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
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <Divider
        css={css`
          width: 80%;
          margin: auto;
        `}
      />
      <div css={containerStyle}>
        <div css={headerStyle}>Career Information</div>
        <div css={sectionStyle}>
          <Collapse in={alertUpdate.type === "user"}>
            <Alert severity="success">정보가 업데이트 되었습니다.</Alert>
          </Collapse>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              width: 100%;
            `}
          >
            <div css={labelStyle}>
              Education
              <FormControl sx={{ width: "45%" }}>
                <Select
                  displayEmpty
                  size="small"
                  value={userData.educationLevel || ""}
                  onChange={(e) =>
                    changeValue("educationLevel", e.target.value)
                  }
                >
                  <MenuItem value="" disabled>
                    학력 구분 선택
                  </MenuItem>
                  <MenuItem value="초등학교 졸업">초등학교 졸업</MenuItem>
                  <MenuItem value="중학교 졸업">중학교 졸업</MenuItem>
                  <MenuItem value="고등학교 졸업">고등학교 졸업</MenuItem>
                  <MenuItem value="대학교대학원 이상 졸업">
                    대학교·대학원 이상 졸업
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {userData.educationLevel === "대학교대학원 이상 졸업" && (
              <>
                <div css={labelStyle}>
                  Univ
                  <TextField
                    placeholder="학교명을 입력하세요"
                    variant="outlined"
                    value={userData.universityName}
                    size="small"
                    sx={{ width: "45%" }}
                    onChange={(e) =>
                      changeValue("universityName", e.target.value)
                    }
                  />
                </div>
                <div css={labelStyle}>
                  Major
                  <TextField
                    placeholder="학과명을 입력하세요"
                    variant="outlined"
                    value={userData.departmentName}
                    size="small"
                    sx={{ width: "45%" }}
                    onChange={(e) =>
                      changeValue("departmentName", e.target.value)
                    }
                  />
                </div>
              </>
            )}
          </div>
          <div css={buttonGroupStyle}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
