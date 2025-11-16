import mongoose,{Document,Schema} from "mongoose";

export interface Icoment {
    user:mongoose.Types.ObjectId;
    text:string;
    createdAt:Date;
}
export interface IPost extends Document{
    user:mongoose.Types.ObjectId;
    caption: String;
    imageUrl?: string;
    likes:mongoose.Types.ObjectId[];
    comments: Icoment[];
}

const commentSchema =new Schema<Icoment>({
    user:{type:Schema.Types.ObjectId, ref:"User", required: true},
    text:{type:String, required: true},
    createdAt:{type:Date, default:Date.now},
},
{_id:false}
);

const postSchema = new Schema<IPost>({
    user:{type:Schema.Types.ObjectId,ref:"User", required:true},
    caption:{type:String,required:true},
    imageUrl:{type:String},
    likes:[{type:Schema.Types.ObjectId,ref:"User"}],
    comments:[commentSchema],
},
{timestamps:true}
);

const Post =mongoose.model<IPost>("Post",postSchema);
export default Post;
