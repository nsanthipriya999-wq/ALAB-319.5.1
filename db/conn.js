import mongoose from 'mongoose'

async function connectDB(){
	try {
		await mongoose.connect('mongodb://nsanthipriya9_db_user:temp123@ac-otj27m1-shard-00-00.5xkujx3.mongodb.net:27017,ac-otj27m1-shard-00-01.5xkujx3.mongodb.net:27017,ac-otj27m1-shard-00-02.5xkujx3.mongodb.net:27017/sample_training?ssl=true&replicaSet=atlas-5icqdw-shard-0&authSource=admin&appName=MongoPractice')
		console.log("MongoDB Connected with Mongoose!")
	} catch(e) {
		console.error(e)
	}
}

export default connectDB

