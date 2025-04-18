import React from 'react';
import { Award, Calendar, Check, ExternalLink } from 'lucide-react';
import { Reward } from '../../types';
import { motion } from 'framer-motion';

interface RewardCardProps {
  reward: Reward;
  onClaim: (rewardId: string) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, onClaim }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const getTypeIcon = () => {
    switch (reward.type) {
      case 'giftCard':
        return <Award className="h-12 w-12 text-orange-500" />;
      case 'certificate':
        return <Award className="h-12 w-12 text-blue-500" />;
      case 'badge':
        return <Award className="h-12 w-12 text-purple-500" />;
      default:
        return <Award className="h-12 w-12 text-gray-500" />;
    }
  };
  
  const getTypeColor = () => {
    switch (reward.type) {
      case 'giftCard':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'certificate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'badge':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`border-2 rounded-lg overflow-hidden shadow-sm ${reward.redeemed ? 'border-gray-200' : 'border-blue-200'}`}
    >
      <div className={`p-5 ${reward.redeemed ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
              {reward.type === 'giftCard' ? 'Gift Card' : reward.type === 'certificate' ? 'Certificate' : 'Badge'}
            </div>
            {reward.redeemed && (
              <div className="inline-flex items-center ml-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border-green-200">
                <Check className="h-3 w-3 mr-1" />
                Redeemed
              </div>
            )}
          </div>
          {getTypeIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{reward.description}</h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
          <span>Issued on {formatDate(reward.issueDate)}</span>
        </div>
        
        {reward.sponsor && (
          <p className="text-sm text-gray-600 mb-4">
            Sponsored by <span className="font-medium">{reward.sponsor}</span>
          </p>
        )}
        
        {!reward.redeemed ? (
          <button
            onClick={() => onClaim(reward.id)}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            <span>Claim Reward</span>
          </button>
        ) : (
          <div className="w-full py-2 px-4 bg-gray-100 text-gray-500 font-medium rounded-lg flex items-center justify-center">
            <ExternalLink className="h-4 w-4 mr-2" />
            <span>View Certificate</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RewardCard;