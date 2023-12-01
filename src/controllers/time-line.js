import TimeLineService from "../services/time-line.js";

const TimeLineController = {
    async getTimeLine(req, res, next) {
        const result = await TimeLineService.getTimeLine(req.user, req.body);
        res.json(result);
    },

    async getTimeLineDetail(req, res, next) {
        const result = await TimeLineService.getTimeLineDetail(req.params.id);
        res.json(result);
    },

    async getTimeLineByUserId(req, res, next) {
        const result = await TimeLineService.getTimeLineByUserId(req.user, req.params.id, req.body);
        res.json(result);
    },
};

export default TimeLineController;
