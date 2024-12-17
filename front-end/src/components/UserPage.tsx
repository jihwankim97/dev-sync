/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState, type SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Collapse,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { login } from "../redux/redux";

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
  value: string | null;
  onChange: (newValue: string) => void;
}

const CustomTextField = ({ label, value, onChange }: CustomTextProps) => (
  <TextField
    placeholder={label}
    variant="outlined"
    value={value || ""}
    onChange={(e) => onChange(e.target.value)} // 입력값 변경 처리
    size="small"
    css={customTextFieldStyle}
    slotProps={
      label === "Github-Name"
        ? {
            input: {
              startAdornment: (
                <InputAdornment position="start">github.com/</InputAdornment>
              ),
            },
          }
        : undefined
    }
  />
);

// UserPage 컴포넌트
export const UserPage = () => {
  const userData = useSelector((state: any) => state.login.loginInfo);
  const dispatch = useDispatch();
  // 로컬 상태로 사용자 데이터 관리
  const [username, setUsername] = useState(userData.username || "");
  const [email, setEmail] = useState(userData.email || "");
  const [githubUrl, setGithubUrl] = useState(userData.githubUrl || "");
  const [blogUrl, setBlogUrl] = useState(userData.blogUrl || "");
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태
  const [previewImage, setPreviewImage] = useState(
    userData.profileImageUrl || ""
  );
  const [alertProfile, setAlertProfile] = useState(false);
  const [alertInfor, setAlertInfor] = useState(false);
  const [endEducation, setEndEducation] = useState<string>("");
  const univApi = import.meta.env.VITE_APP_UNIVLIST_API_KEY;
  const univUrl = import.meta.env.VITE_APP_UNIV_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${univUrl}?serviceKey=${univApi}&type=json`
        );
        const result = await response.json();
        console.log(result);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userData) {
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setGithubUrl(userData.githubUrl || "");
      setBlogUrl(userData.blogUrl || "");
      setPreviewImage(userData.profileImageUrl || "");
    }
  }, [userData]);

  const handlePreviewChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // 선택한 파일로부터 URL 생성
      setPreviewImage(imageUrl); // 미리보기 이미지 설정
      setSelectedFile(event.target.files[0]);
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
      const response = await fetch("http://localhost:3000/user/updateProfile", {
        method: "POST",
        body: formData,
        credentials: "include", // 세션 쿠키 포함
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Profile image update success:", result);
        setAlertProfile(true);
        dispatch(login(result));
      } else {
        const error = await response.json();
        console.error("Profile image update failed:", error.message || error);
      }
    } catch (error) {
      console.error("Error during profile update:", error);
    }
  };

  const handleSave = async () => {
    const response = await fetch("http://localhost:3000/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include", // 세션 쿠키 포함

      body: JSON.stringify({
        email,
        username,
        githubUrl,
        blogUrl,
      }),
    });
    if (response.ok) {
      const result = await response.json();
      console.log("Update success:", result.githubUrl);
      dispatch(login(result));
      setAlertInfor(true);
    } else {
      const error = await response.json();
      console.error("Update failed:", error);
    }
  };

  useEffect(() => {
    if (userData.profileImageUrl) {
      setPreviewImage(userData.profileImageUrl);
    }
  }, [userData.profileImageUrl]);

  const handleEducationChange = (e: SelectChangeEvent<string>) => {
    console.log(e.target.value);
    setEndEducation(e.target.value);
  };

  return (
    <>
      <div css={containerStyle}>
        <div css={headerStyle}>Profile</div>
        <div css={sectionStyle}>
          <Collapse in={alertProfile}>
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
          <Collapse in={alertInfor}>
            <Alert severity="success">프로필이 업데이트 되었습니다.</Alert>
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
                value={username}
                onChange={setUsername}
              />
            </div>
            <div css={labelStyle}>
              E-mail
              <CustomTextField
                label="E-mail"
                value={email}
                onChange={setEmail}
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
                label="Github-Name"
                value={githubUrl}
                onChange={setGithubUrl}
              />
            </div>
            <div css={labelStyle}>
              Blog
              <CustomTextField
                label="Blog"
                value={blogUrl}
                onChange={setBlogUrl}
              />
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
                css={longTextFieldStyle}
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
          <Collapse in={alertProfile}>
            <Alert severity="success">프로필이 업데이트 되었습니다.</Alert>
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
                  value={endEducation}
                  onChange={handleEducationChange}
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
            {endEducation === "대학교대학원 이상 졸업" && (
              <div css={labelStyle}>
                Univ
                <TextField
                  placeholder="학교명을 입력하세요"
                  variant="outlined"
                  size="small"
                  sx={{ width: "45%" }}
                />
              </div>
            )}
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
    </>
  );
};
