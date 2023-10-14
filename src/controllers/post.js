import PostService from "../services/post.js";

const PostController = {
    async getPosts(req, res, next) {
        try {
            const result = await PostService.getPosts();
            res.json(result);
        } catch (e) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách bài viết"], null));
        }
    },

    async getPostById(req, res, next) {
        try {
            const result = await PostService.getPostById(req.params.id);
            res.json(result);
        } catch (e) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi lấy danh sách bài viết"], null));
        }
    },

    async createPost(req, res, next) {
        try {
            const result = await PostService.createPost(req.user, req.body);
            res.json(result);
        } catch (error) {
            return res.status(500).json(new ResponseModel(500, ["Lỗi thêm bài viết"], null));
        }
    },
};

export default PostController;
