// Pastikan fungsi-fungsi ini sudah benar di Formatter.js
export const getSessionData = () => {
    try {
        const sessionData = localStorage.getItem("session");
        if (sessionData) {
            return JSON.parse(sessionData);
        }
        
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            return {
                userId: user.user_id || user.id,
                roleName: user.role_name || user.roleName || user.role,
                email: user.email,
                name: user.name
            };
        }
        
        return null;
    } catch (error) {
        console.error("Error getting session data:", error);
        return null;
    }
};

export const getUserRole = () => {
    try {
        const session = getSessionData();
        if (session?.roleName) {
            return session.roleName;
        }
        
        // Coba dari user data
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            return user.role_name || user.roleName || "Guest";
        }
        
        return "Guest";
    } catch (error) {
        console.error("Error getting user role:", error);
        return "Guest";
    }
};

export const isAdminOrOwner = () => {
    const role = getUserRole();
    const adminRoles = ["Admin", "Super Admin", "Owner", "admin", "super admin", "owner"];
    return adminRoles.includes(role);
};