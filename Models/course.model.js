
import { Schema, model } from "mongoose"

const CourseSchema = new Schema({
    title: {
        type: String,  
    },
    description: {
        type:String
    },
    category: {
        type:String
    },

  thumbnail:{
      public_id: {
          type:String
      },
      secure_url: {
          type:String
      }
    },

    lectures: [

        {
            title: String,
            description: String,
            lecture: {
                public_id: {
                   type:String 
                },
                secure_url: {
                    type:String
                }
            }
        }
    ],
    numbersOfLectures: {
        type:Number
    },
    createdBy: {
        type:String
    }

        
    
},
    {
        timestamps:true
    }

)

const Course = model("Course",CourseSchema)

export default Course;