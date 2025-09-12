import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js'
import { v2 as cloudinary } from 'cloudinary'

export const updateRoleToEducator = async (req, res)=>{
   try  {
   const userId = req.auth.userId

     await clerkClient.users.updateUserMetadata(userId, {
     publicMetadata: {
        role: 'educator',
     }
     })

     res.json({success: true, message: 'You can publish a course now'})
   } catch (error) {
    res.json({success: false, message: error.message})


   }


}

export const addCourse = async (req, res)=>{
try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = typeof req.auth === 'function' ? req.auth().userId : req.auth?.userId;

    if(!imageFile){
         console.log('No image file attached');
         return res.json({ success: false, message: 'Thumbnail Not Attached'})
      }

      let parsedCourseData;
      try {
         parsedCourseData = JSON.parse(courseData);
      } catch (err) {
         console.log('JSON parse error:', err);
         return res.json({ success: false, message: 'Invalid courseData JSON' });
      }
      parsedCourseData.educator = educatorId;
      let newCourse;
      try {
         newCourse = await Course.create(parsedCourseData);
      } catch (err) {
         console.log('MongoDB create error:', err);
         return res.json({ success: false, message: 'MongoDB error: ' + err.message });
      }
      let imageUpload;
      try {
         imageUpload = await cloudinary.uploader.upload(imageFile.path);
      } catch (err) {
         console.log('Cloudinary upload error:', err);
         return res.json({ success: false, message: 'Cloudinary error: ' + err.message });
      }
      newCourse.courseThumbnail = imageUpload.secure_url;
      await newCourse.save();

    res.json({ success: true, message: 'Course Added'})
} catch (error) {
    console.log('General error:', error);
    res.json({ success: false, message: error.message })
}
}

export const getEducatorCourses = async (req, res) => {
    try {
       const educator = typeof req.auth === 'function' ? req.auth().userId : req.auth?.userId;
       const courses = await Course.find({ educator });
       res.json({ success: true, courses });
    } catch (error) {
       console.log('Get courses error:', error);
       res.json({ success: false, message: error.message });
    }
}

export const educatorDashboardData = async (req, res)=> {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({educator});
    const totalCourses = courses.length;
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({
    courseId: {$in: courseIds},
    status: 'completed'

    });

    const totalEarnings = purchases.reduce((sum, purchase)=> sum + purchase.amount, 0);

    const enrolledStudentsData = [];
    for(const course of courses){
    const students  = await User.find({
    _id: {$in: course.enrolledStudents}

    }, 'name imageUrl');

    students.forEach(student => {
    enrolledStudentsData.push({
       courseTitle: course.courseTitle,
       student
    });


    });

    }

    res.json({success: true, dashboardData: {
    totalEarnings, enrolledStudentsData, totalCourses
    

    }})

  } catch (error) {
   res.json({ success: false, message: error.message});



  }

  }

  export const getEnrolledStudentsData = async (req, res)=> {
   try {
      const educator = req.auth.userId;
      const courses = await Course.find({educator});
      const courseIds = courses.map(course => course._id);

      const purchase = await Purchase.find({
         courseId: { $in: courseIds },
         status: 'completed'
      }).populate('userId','name imageUrl').populate('courseId', 'courseTitle')

      const enrolledStudents = purchase.map(purchase => ({
         students: purchase.userId,
         courseTitle: purchase.courseId.courseTitle,
         purchaseDate: purchase.createdAt

   
      }));
      res.json({success: true, enrolledStudents})

   }  catch (error) {
      res.json({ success: false, message: error.message});


   }



  }


