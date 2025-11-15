import mongoose,{Document,Schema} from "mongoose";

export interface IPost extends Document{
    user:mongoose.Types.ObjectId;
    caption: String;
    imageUrl?: string;
    likes:mongoose.Types.ObjectId[];
}

const postSchema = new Schema<IPost>({
    user:{type:Schema.Types.ObjectId,ref:"User", required:true},
    caption:{type:String,required:true},
    imageUrl:{type:String},
    likes:[{type:Schema.Types.ObjectId,ref:"User"}],
},
{timestamps:true}
);

const Post =mongoose.model<IPost>("Post",postSchema);
export default Post;
