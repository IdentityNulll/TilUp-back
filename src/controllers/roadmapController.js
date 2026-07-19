import Roadmap from '../models/Roadmap.js';
import { buildRoadmapView } from '../services/roadmapService.js';

export const getRoadmap = async (req, res) => {
  const roadmap = await Roadmap.findOne({ user: req.user._id });
  res.status(200).json(buildRoadmapView(req.user, roadmap));
};
