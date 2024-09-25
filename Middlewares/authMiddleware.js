const authenticateToken = (req, res, next) => {
    const token = localStorage.getItem("selfsteerAuthToken"); 
    
    if (!token) {
        return res.status(401).json({ message: 'Authorization token not found' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;  // Attach decoded user info to the request
        next();
    });
};

export default authenticateToken;
