import { css } from "@emotion/react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import { setResume } from "../../redux/resumeSlice";
import { GetExistResume } from "../../api/GetExistResume";

type ResumeSummary = {
  id: string;
  fam_skills: [];
  str_skills: [];
  title: string;
  createAt: string;
  updateAt: string;
  order: any[];
  entities: any[];
  profile: ProfileType;
};

type ProfileType = {
  id: number;
  email: string;
  name: string;
  phoneNumber: number;
  githubUrl: string;
  blogUrl: string;
  birthDate: string;
};

type PaginationMeta = {
  total: number;
  page: number;
  take: number;
  totalPages: number;
};

type PaginatedResponse = {
  data: ResumeSummary[];
  meta: PaginationMeta;
};

export const ResumeListPage = () => {
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    take: 8,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ListUpdate, setListUpdate] = useState(false);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const fetchResumes = async (id: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/resumes/${id}`, {
  //       method: "GET",
  //       credentials: "include",
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     dispatch(setResume(data));
  //   } catch (error) {
  //     console.error("이력서 가져오기 실패:", error);
  //   }
  // };

  // const handleClick = (id: string) => {
  //   // navigate("/Users"); // 새로운 경로로 이동
  //   fetchResumes(id);
  // };

  const handleOption = (e: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(e.currentTarget);
    setSelectedId(id);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`http://localhost:3000/resumes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await response.json();
    setListUpdate(!ListUpdate);
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/resumes?page=${currentPage}&take=8`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: PaginatedResponse = await response.json();
        setResumes(result.data || []);
        setPaginationMeta((prev) => result.meta || prev);
      } catch (error) {
        console.error("이력서 리스트 가져오기 실패:", error);
        setResumes([]);
      }
    };

    fetchResumes();
  }, [ListUpdate, currentPage]);

  const handleEntryResume = async (id: string) => {
    const result = await GetExistResume(id);

    navigate(`/resume/${result.id}/editor`);
    dispatch(setResume(result));
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  return (
    <Box
      css={css`
        max-width: 900px;
        margin: auto;
        padding: 0 1rem;
      `}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom color="#ffffff">
        기존 이력서 목록
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {resumes.length === 0 ? (
        <Box
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 300px;
            flex-direction: column;
          `}
        >
          <Typography
            variant="body1"
            color="#ffffff"
            css={css`
              margin-bottom: 1rem;
            `}
          >
            아직 등록된 이력서가 없습니다.
          </Typography>
          <Typography
            variant="body2"
            color="#cccccc"
            onClick={() => navigate("/resume")}
            css={css`
              cursor: pointer;
              text-decoration: underline;
              font-size: 0.875rem;
              &:hover {
                color: #ffffff;
              }
            `}
          >
            새로운 이력서를 만들어보세요!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {resumes.map((resume, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={resume.id ?? `resume-${index}`}
            >
              <Card
                variant="outlined"
                css={css`
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  transition: box-shadow 0.3s ease;
                  color: #333333;
                  background-color: #ffffffdf;
                  &:hover {
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                  }
                `}
              >
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  disableScrollLock
                  slotProps={{
                    paper: {
                      // 그림자 0
                      // elevation: 0,
                      sx: {
                        mt: 1,
                        boxShadow: "2px 2px 4px rgba(217, 217, 217, 0.08)",
                        borderRadius: "8px",
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => selectedId && handleEntryResume(selectedId)}
                    disabled={
                      selectedId
                        ? resumes.find((r) => r.id === selectedId)?.title ===
                          "생성중인 자소서"
                        : false
                    }
                  >
                    수정하기
                  </MenuItem>
                  <MenuItem
                    onClick={() => selectedId && handleDelete(selectedId)}
                  >
                    삭제하기{" "}
                  </MenuItem>
                </Menu>

                <CardContent>
                  <div
                    css={css`
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    `}
                  >
                    <div
                      css={css`
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        flex: 1;
                      `}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        {resume.title}
                      </Typography>
                      {resume.title === "생성중인 자소서" && (
                        <CircularProgress size={16} />
                      )}
                    </div>
                    <IconButton onClick={(e) => handleOption(e, resume.id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </div>

                  <Typography
                    variant="caption"
                    css={css`
                      margin-bottom: 0.8rem;
                      color: #767676;
                      display: block;
                    `}
                  >
                    {resume?.updateAt?.split("T")[0]}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    css={css`
                      margin-bottom: 0.25rem;
                      display: block;
                    `}
                  >
                    {resume.profile.email}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    css={css`
                      margin-bottom: 0.5rem;
                      display: block;
                    `}
                  >
                    {resume.profile.phoneNumber}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ gap: 1 }}
                    flexWrap="wrap"
                  >
                    {[
                      ...(Array.isArray(resume?.fam_skills)
                        ? resume.fam_skills
                        : []),
                      ...(Array.isArray(resume?.str_skills)
                        ? resume.str_skills
                        : []),
                    ].map(
                      (
                        skill: { id: string; icon: string; name: string },
                        idx
                      ) => (
                        <Chip
                          key={idx}
                          label={skill.name}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "0.75rem",
                            height: "24px",
                          }}
                        />
                      )
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {paginationMeta.totalPages > 0 && (
        <Box
          css={css`
            display: flex;
            justify-content: center;
            margin-top: 3rem;
            margin-bottom: 2rem;
          `}
        >
          <Pagination
            count={paginationMeta.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#ffffff",
                fontSize: "0.875rem",
              },
              "& .Mui-selected": {
                backgroundColor: "#1976d2",
                color: "#ffffff",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};
