import express from "express";
import db from "../db/conn.js";
import { ObjectId } from "mongodb";
import Grade from "../models/gradeModel.js"
const router = express.Router();

// -------------------------Create a single grade entry-------------------------------------------
router.post("/", async (req, res) => {
  try{

    console.log(req.body);
  const grade=new Grade(req.body);
 
  await grade.save();
  res.status(201).json(grade);

  }catch(err){

    res.status(400).json({error:err.message});
  }


});

// ------Get a single grade entry---------------------------------------------
router.get("/:id", async (req, res) => {

  const grade=await Grade.findById(req.params.id);
  if(grade){

  
  res.status(200).json(grade);
  }
  else
    res.status(404).json({message:'Grade not found'});
    
});

// ----------------------------Add a score to a grade entry-----------------------------------------------
router.patch("/:id/add", async (req, res) => {
  const grade=await Grade.findByIdAndUpdate(
    req.params.id,
    {
      $push:{
        scores:req.body
      }
    },
    {
      new:true,
      runValidators:true

    }
    
  );
  if(grade){
    res.status(200).json(grade);
  }
  else{
    return res.status(404).json({message:'Grade not found'});
  }
  
});

// ----Remove a score from a grade entry-----------------------------
router.patch("/:id/remove", async (req, res) => {
  const grade=await Grade.findByIdAndUpdate(
    req.params.id,
    {
      $pull:{
        scores:req.body
      }
    },
    {
      //new:true
      returnDocument: 'after' 
    }
    
  );
 if(grade){
    res.status(200).json(grade);
  }
  else{
    return res.status(404).json({message:'Grade not found'});
  }
  
});

//-----------------Delete a single grade entry----------------------------
router.delete("/:id", async (req, res) => {
  const grade=await Grade.findByIdAndDelete(req.params.id);
  if(grade){
    res.status(200).json({message:"Grade deleted",grade});
  }
  else{
    return res.status(404).json({message:'Grade not found'});
  }


});

//------------------------------------Get route for backwards compatibility--------------------------------------------------------

router.get("/student/:id",  (req, res) => {

  res.redirect(`/grades/learner/${req.params.id}`);
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  
 const query={student_id:Number(req.params.id)};
 
 const result=await Grade.find(query).limit(10);
 console.log(result);
 if (result.length===0){
  return res.status(404).json("no data exists with that id");
 }
 res.status(200).json(result);
 
});

// --------------------------------Delete a learner's grade data------------------------------
router.delete("/learner/:id", async (req, res) => {
  const query={student_id:Number(req.params.id)};
 
 const result=await Grade.deleteMany(query);
 console.log(result);

if(result.deletedCount!==0){
  res.status(200).json(result);
}
else
{
  res.status(404).json({message:"no grades found"});
}
  });
  
//------------------------- Get a class's grade data------------------------------
router.get("/class/:id", async (req, res) => {
  const query={ class_id:Number(req.params.id),};
  
  if(req.query.student){
    query.student_id=Number(req.query.student);
  }

  const result=await Grade.find(query);

  if (result.length===0)
  {
    return res.status(404).json({message:"No grades found:"});
  }
 

  res.status(200).json(result);
 
});

// ------------------------------Update a class id------------------------------
router.patch("/class/:id", async (req, res) => {
  const query={
    class_id:Number(req.params.id),
  };
  

  const result = await Grade.updateMany(
    query,
    {
      $set: { 
             class_id: req.body.class_id 
            }
       }
    );

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// --------------------------Delete a class-----------------------------------
router.delete("/class/:id", async (req, res) => {

  let query = { class_id: Number(req.params.id) };

  const result = await Grade.deleteMany(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;
