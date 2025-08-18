const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel');
const communityPostModel = require('../models/communityPostModel');
const userProfileModel = require('../models/userProfileModel');

// Helper to wrap async
const wrap = fn => (req,res,next)=> fn(req,res,next).catch(next);

// Create Post
router.post('/createPost', wrap(async (req,res) => {
  console.log('[community] createPost body keys:', Object.keys(req.body));
  const { userId, content, imageBase64 } = req.body || {};
  if(!userId || !content) return res.json({ success:false, message:'userId & content required'});
  const user = await userModel.findById(userId);
  if(!user) return res.json({ success:false, message:'User not found'});
  const post = await communityPostModel.create({ author:userId, authorName: user.username || user.name, content, imageBase64 });
  // attach author profile picture (if exists)
  const profile = await userProfileModel.findOne({ userId });
  const postObj = post.toObject();
  postObj.authorProfilePicture = profile?.profilePicture || null;
  return res.json({ success:true, post: postObj });
}));

// List Posts (POST & GET for flexibility)
const listHandler = wrap(async (req,res)=> {
  const posts = await communityPostModel.find().sort({ createdAt:-1 }).limit(100);
  // gather unique author IDs
  const authorIds = [...new Set(posts.map(p=> p.author.toString()))];
  const profiles = await userProfileModel.find({ userId: { $in: authorIds } }, 'userId profilePicture');
  const picMap = new Map(profiles.map(pr=> [pr.userId.toString(), pr.profilePicture]));
  const enriched = posts.map(p=> {
    const o = p.toObject();
    o.authorProfilePicture = picMap.get(p.author.toString()) || null;
    return o;
  });
  return res.json({ success:true, posts: enriched });
});
router.post('/list', listHandler);
router.get('/list', listHandler);

// Comment
router.post('/comment', wrap( async (req,res)=> {
  const { userId, postId, content } = req.body || {};
  if(!userId || !postId || !content) return res.json({ success:false, message:'userId, postId & content required'});
  const user = await userModel.findById(userId);
  const post = await communityPostModel.findById(postId);
  if(!user || !post) return res.json({ success:false, message:'Not found'});
  post.comments.push({ user: userId, username: user.username || user.name, content });
  await post.save();
  const profile = await userProfileModel.findOne({ userId: post.author });
  const postObj = post.toObject();
  postObj.authorProfilePicture = profile?.profilePicture || null;
  return res.json({ success:true, post: postObj });
}));

// Delete Post (author only)
router.delete('/post/:id', wrap(async (req,res)=>{
  const postId = req.params.id;
  const userId = (req.body && req.body.userId) || req.query.userId || req.headers['x-user-id'];
  if(!userId) return res.status(400).json({ success:false, message:'userId required (body, query userId=, or x-user-id header)'});
  console.log('[community] delete attempt', { postId, userId });
  const post = await communityPostModel.findById(postId);
  if(!post) return res.status(404).json({ success:false, message:'Post not found'});
  if(post.author.toString() !== userId) return res.status(403).json({ success:false, message:'Not authorized to delete this post'});
  await post.deleteOne();
  console.log('[community] deleted post', postId);
  return res.json({ success:true, message:'Post deleted', postId });
}));

module.exports = router;
