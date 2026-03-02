import { CommunityPost, Pet } from './types';

export const seedPets: Pet[] = [
  {
    id: 1,
    name: '糖糖',
    type: '猫咪',
    age: '2岁',
    city: '上海',
    health: '已绝育/已免疫/已驱虫',
    temperament: '亲人、安静',
    story: '曾在地下车库流浪三个月，现已恢复健康。',
    rescuedAt: '2026-01-12',
    adopted: false,
    urgency: '中'
  },
  {
    id: 2,
    name: '阿福',
    type: '狗狗',
    age: '1岁半',
    city: '杭州',
    health: '已免疫/已驱虫',
    temperament: '活泼、喜欢户外',
    story: '原家庭无法继续照料，等待负责任的新家庭。',
    rescuedAt: '2026-01-24',
    adopted: false,
    urgency: '低'
  },
  {
    id: 3,
    name: '小麦',
    type: '猫咪',
    age: '8个月',
    city: '南京',
    health: '已免疫，术后恢复中',
    temperament: '爱互动、需要适应期',
    story: '雨夜被发现时严重脱水，治疗后状态稳定。',
    rescuedAt: '2026-02-08',
    adopted: false,
    urgency: '高'
  }
];

export const seedPosts: CommunityPost[] = [
  {
    id: 1,
    author: '救助站小李',
    topic: '救助故事',
    content: '本周完成 5 只流浪猫 TNR，感谢志愿者凌晨值守。',
    createdAt: '2026-02-25'
  }
];

export const articleCards = [
  {
    title: '领养前准备：预算与时间评估',
    content: '建议预留首年医疗与日常预算，确保稳定陪伴。'
  },
  {
    title: '科学养宠：疫苗、绝育、驱虫节律',
    content: '按月建立健康日历，减少疾病传播与二次流浪风险。'
  },
  {
    title: '救助透明化：资金与流程公开',
    content: '公开捐赠去向、审核状态与回访结果，建立社会信任。'
  }
];
