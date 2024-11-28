


export const LogoutComponent = () => {
    window.location.href = "/";
    localStorage.clear();
    Cookies.remove("userdata");
    Cookies.remove("token");
    window.location.reload();
};