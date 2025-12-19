const LogoutButton = () => {
  const fetchUserData = async () => {
    fetch("http://localhost:3000/auth/logout", {
      method: "GET",
      credentials: "include", // 쿠키를 포함하여 요청
    })
      .then((response) => {
        if (response.ok) {
          console.log("Logged out");
          window.location.href = "/login"; // 로그아웃 후 리디렉션
        }
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  return (
    <>
      <button onClick={fetchUserData}>로그 아웃</button>
    </>
  );
};

export default LogoutButton;
