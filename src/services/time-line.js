import Comment from "../models/base/Comment.js";
import Following from "../models/base/Following.js";
import Post from "../models/base/Post.js";

const TimeLineService = {
    async getTimeLine(user) {
        const followingsOfUser = await Following.find({
            user: user,
        }).sort({createdAt: -1});

        const listMyPost = await Post.find({
            user: user,
        }).sort({createdAt: -1});

        let listFollowingPost = [];

        await Promise.all(
            followingsOfUser.map(async (following) => {
                const followingPost = await Post.find({
                    user: following.following,
                });

                listFollowingPost.push(followingPost);
            })
        );

        console.log(listFollowingPost);



        return { listMyPost, listFollowingPost };
    },

    async getTimeLineDetail(post_id){
        const post =  await Post.findById(post_id);

        const comments = await Comment.find({
            post: post
        })

        return {post, comments};
    }
};

export default TimeLineService;
