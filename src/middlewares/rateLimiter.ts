import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
    windowMs: 10 * 1000, // 10 seconds
    limit: 5, // Limit each IP to 5 requests per window
    message: 'Too many requests from this IP, please try again after 10 seconds',
});
