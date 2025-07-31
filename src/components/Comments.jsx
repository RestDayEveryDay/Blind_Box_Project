// src/components/Comments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Comments({ momentId, isVisible, onToggle }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUserId = parseInt(localStorage.getItem('userId'));
  const currentUserRole = localStorage.getItem('userRole');
  const isAdmin = currentUserRole === 'admin' || currentUserId === 1;

  // 获取评论列表
  const fetchComments = async () => {
    if (!momentId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/moments/${momentId}/comments`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('获取评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 发布评论或回复
  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      alert('请输入评论内容');
      return;
    }

    if (!currentUserId) {
      alert('请先登录');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        user_id: currentUserId,
        content: newComment.trim(),
        reply_to_id: replyTo?.id || null
      };

      const response = await axios.post(`/api/moments/${momentId}/comments`, payload);
      
      // 清空输入框和回复状态
      setNewComment('');
      setReplyTo(null);
      
      // 重新获取评论列表
      await fetchComments();
      
    } catch (error) {
      console.error('发布评论失败:', error);
      const errorMessage = error.response?.data?.error || '发布评论失败';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // 删除评论
  const handleDeleteComment = async (commentId) => {
    if (!confirm('确定要删除这条评论吗？')) {
      return;
    }

    try {
      await axios.delete(`/api/moments/comments/${commentId}`, {
        data: { user_id: currentUserId }
      });
      
      // 重新获取评论列表
      await fetchComments();
      
    } catch (error) {
      console.error('删除评论失败:', error);
      const errorMessage = error.response?.data?.error || '删除评论失败';
      alert(errorMessage);
    }
  };

  // 设置回复
  const handleReply = (comment) => {
    setReplyTo(comment);
    // 自动聚焦到输入框
    setTimeout(() => {
      const textarea = document.querySelector('.comment-input');
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  };

  // 取消回复
  const handleCancelReply = () => {
    setReplyTo(null);
  };

  // 格式化时间
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN');
  };

  // 建立评论层级关系
  const buildCommentTree = (comments) => {
    const commentMap = {};
    const rootComments = [];

    // 首先创建所有评论的映射
    comments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    // 然后建立层级关系
    comments.forEach(comment => {
      if (comment.reply_to_id) {
        // 这是一个回复
        const parentComment = commentMap[comment.reply_to_id];
        if (parentComment) {
          parentComment.replies.push(commentMap[comment.id]);
        } else {
          // 如果找不到父评论，当作根评论处理
          rootComments.push(commentMap[comment.id]);
        }
      } else {
        // 这是一个根评论
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  // 渲染单个评论
  const renderComment = (comment, isReply = false) => {
    const canDelete = isAdmin || comment.user_id === currentUserId;
    
    return (
      <div key={comment.id} className={`${isReply ? 'ml-8 mt-2' : 'mt-3'}`}>
        <div className={`p-3 rounded-lg ${isReply ? 'bg-gray-50' : 'bg-white border border-gray-100'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">
                  {comment.username}
                </span>
                {comment.role === 'admin' && (
                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-xs rounded">
                    管理员
                  </span>
                )}
                {comment.reply_to_username && (
                  <span className="text-gray-500 text-xs">
                    回复 @{comment.reply_to_username}
                  </span>
                )}
              </div>
              
              <p className="text-gray-800 text-sm leading-relaxed mb-2">
                {comment.content}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{formatDate(comment.created_at)}</span>
                <button
                  onClick={() => handleReply(comment)}
                  className="hover:text-blue-500 transition-colors"
                >
                  回复
                </button>
                {canDelete && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="hover:text-red-500 transition-colors"
                  >
                    删除
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* 渲染回复 */}
        {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
      </div>
    );
  };

  // 当组件显示时加载评论
  useEffect(() => {
    if (isVisible && momentId) {
      fetchComments();
    }
  }, [isVisible, momentId]);

  if (!isVisible) {
    return null;
  }

  const commentTree = buildCommentTree(comments);

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
      {/* 评论列表 */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-500">加载评论中...</span>
          </div>
        ) : commentTree.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            还没有评论，快来抢沙发吧！
          </div>
        ) : (
          commentTree.map(comment => renderComment(comment))
        )}
      </div>

      {/* 评论输入区 */}
      <div className="mt-4 space-y-2">
        {replyTo && (
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                回复 @{replyTo.username}: {replyTo.content.slice(0, 50)}
                {replyTo.content.length > 50 ? '...' : ''}
              </span>
              <button
                onClick={handleCancelReply}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                取消
              </button>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <textarea
            className="comment-input flex-1 border border-gray-300 rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder={replyTo ? `回复 @${replyTo.username}...` : "写下你的评论..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            maxLength={500}
          />
          <button
            onClick={handleSubmitComment}
            disabled={submitting || !newComment.trim()}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              submitting || !newComment.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {submitting ? '发布中...' : '发布'}
          </button>
        </div>
        
        <div className="text-right text-xs text-gray-500">
          {newComment.length}/500
        </div>
      </div>
    </div>
  );
}