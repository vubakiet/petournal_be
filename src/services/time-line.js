import mongoose from "mongoose";
import Comment from "../models/base/Comment.js";
import Following from "../models/base/Following.js";
import Post from "../models/base/Post.js";

const TimeLineService = {
    async getTimeLine(user, body) {
        const page = body.page || 1;

        const followingsOfUser = await Following.find({
            user: user,
        }).sort({ createdAt: -1 });

        const myPosts = await Post.find({
            user: user,
            pets: { $not: { $size: 0 } },
            status: 1,
        }).sort({ createdAt: -1 });

        const listMyPost = myPosts.map((post) => ({
            ...post.toObject(),
        }));

        let listFollowingPost = [];

        await Promise.all(
            followingsOfUser.map(async (following) => {
                const followingPost = await Post.find({
                    user: following.following,
                    pets: { $not: { $size: 0 } },
                    status: 1,
                }).sort({ createdAt: -1 });

                const followingPostWithIsCheck = followingPost.map((post) => ({
                    ...post.toObject(),
                    isFollowing: true,
                }));

                listFollowingPost.push(followingPostWithIsCheck);
            })
        );

        const timeLine = listMyPost.flat().concat(listFollowingPost.flat());

        await Promise.all(
            timeLine.map(async (post) => {
                const userId = user._id.toString();
                const isLiked = post.likes.includes(userId);
                post.isLiked = isLiked;
            })
        );

        timeLine.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            // Sắp xếp giảm dần
            return dateB - dateA;
        });

        // Implement pagination
        const pageSize = 3; // You can adjust the page size as needed
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedTimeLine = timeLine.slice(startIndex, endIndex);

        return paginatedTimeLine;
    },

    async getTimeLineDetail(post_id) {
        const post = await Post.findById(post_id);

        const comments = await Comment.find({
            post: post,
        });

        return { post, comments };
    },

    async getTimeLineByUserId(user, user_id, body) {
        const page = body.page || 1;
        const limit = body.limit || 3;
        const skip = (page - 1) * limit;

        const listPosts = await Post.find({
            user: user_id,
            pets: { $not: { $size: 0 } },
            status: 1,
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const timeLine = listPosts.map((post) => ({
            ...post.toObject(),
        }));

        await Promise.all(
            timeLine.map(async (post) => {
                const userId = user._id.toString();
                const isLiked = post.likes.includes(userId);
                const isFollowing = await Following.exists({ user, following: post.user });

                post.isLiked = isLiked;
                post.isFollowing = Boolean(isFollowing);
            })
        );

        return timeLine;
    },
};

export default TimeLineService;
