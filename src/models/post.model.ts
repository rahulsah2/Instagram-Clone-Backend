import mongoose,{Document,Schema} from "mongoose";


export interface IPost extends Document{
    user:mongoose.Types.ObjectId;
    caption: String;
    imageUrl?: string;
}



const postSchema = new Schema<IPost>({
    user:{type:Schema.Types.ObjectId,ref:"User", required:true},
    caption:{type:String,required:true},
    imageUrl:{type:String},
},
{timestamps:true}
);

const Post =mongoose.model<IPost>("Post",postSchema);
export default Post;
