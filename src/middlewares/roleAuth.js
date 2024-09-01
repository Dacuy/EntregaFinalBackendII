const checkRoleAuth = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                error: 'Access denied. Insufficient permissions.'
            });
        }
        next();
    };
};

export default checkRoleAuth;

