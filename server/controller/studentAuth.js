import jwt from 'jsonwebtoken'

async function studentAuth(req, res, next) {

    const studentToken = req.cookies.studentToken

    if(!studentToken) return res.status(402).json({authenticated: false})

    try {
        const decoded = jwt.verify(studentToken,process.env.STUDENT_JWT_SECRET)

        req.student = decoded

        console.log(decoded,'decoded student');
        
        next()

    } catch (error) {

        res.status(500).json({authenticated: false, message:'invalid token'})
        
    }
    
}


export default studentAuth