export type PetType = '猫咪' | '狗狗';

export type Pet = {
  id: number;
  name: string;
  type: PetType;
  age: string;
  city: string;
  health: string;
  temperament: string;
  story: string;
  rescuedAt: string;
  adopted: boolean;
  urgency: '高' | '中' | '低';
};

export type ApplicationStatus = '待审核' | '家访中' | '通过' | '拒绝';

export type AdoptionApplication = {
  id: number;
  petId: number;
  petName: string;
  applicant: string;
  phone: string;
  housing: string;
  experience: string;
  hasFamilyConsent: boolean;
  canAffordMedical: boolean;
  acceptVisit: boolean;
  createdAt: string;
  status: ApplicationStatus;
};

export type Volunteer = {
  id: number;
  name: string;
  city: string;
  skills: string;
  availability: string;
  hasPetExperience: boolean;
};

export type Donation = {
  id: number;
  donor: string;
  amount: number;
  message: string;
  date: string;
  usage: '医疗救助' | '临时寄养' | '绝育行动' | '科普宣传';
};

export type CommunityPost = {
  id: number;
  author: string;
  content: string;
  topic: '领养日常' | '救助故事' | '科学养宠';
  createdAt: string;
};
