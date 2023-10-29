import TimeLineService from "../services/time-line.js"

const TimeLineController = {
    async getTimeLine(req, res, next){
        const result = await TimeLineService.getTimeLine(req.user);
        res.json(result);
    },

    async getTimeLineDetail(req, res, next){
        const result = await TimeLineService.getTimeLineDetail(req.params.id);
        res.json(result);
    }
}

export default TimeLineController;