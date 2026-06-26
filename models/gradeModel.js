import mongoose from 'mongoose';

const gradeSchema=new mongoose.Schema({
  student_id:{
    type:Number,
    required:true
  },

  scores:[
    {
      type:{
        type:String,
        required:true,
        enum:["exam","quiz","homework"]
      },
      score:Number
    }
  ],
 class_id:{
  type:Number,
  required:true
 }
});



export default mongoose.model("Grade", gradeSchema);
