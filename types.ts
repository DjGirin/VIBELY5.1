// types.ts

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isOnline: boolean;
  isFollowing: boolean;
  isContributor: boolean;
  bio: string;
  genreTags: string[];
  followersCount: number;
  followingCount: number;
  followingIds: string[];
  skillTags?: string[];
  equipment?: string[];
  collaborationRating?: number;
  completedCollabs?: number;
  responseRate?: number;
}

export interface CollaborationReview {
  id: string;
  reviewer: User;
  projectTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
  role: string;
}

export type MediaType = 'audio' | 'image' | 'video';

export interface Media {
  id: string;
  title: string;
  artist: string;
  fileUrl: string;
  albumArtUrl: string;
  mediaType: MediaType;
  duration?: number; // in seconds for audio/video
  genre: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  timestamp: number; // for audio comments, in seconds
  reactions?: { [emoji: string]: string[] }; // emoji -> list of user ids
}

export interface Post {
  id: string;
  author: User;
  postedAt: string;
  description: string;
  media: Media;
  likes: number;
  comments: Comment[];
  portfolioProjectId?: string; // Link to a portfolio project
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface NotificationState {
  notifications: Notification[];
}

export interface NotificationActions {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export type MessageType = 'text' | 'post_share' | 'prompt_share';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | Post | { promptText: string };
  type: MessageType;
  timestamp: string;
  isRead: boolean;
  reactions?: { [emoji: string]: string[] };
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
}

export interface Playlist {
  id: string;
  name: string;
  authorId: string;
  description: string;
  trackIds: string[];
  coverArtUrl: string | string[]; // Single or collage of 4
}

export type ThreadCategory = 'collaboration' | 'challenge' | 'feedback' | 'showcase' | 'general';

export interface Reply {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  votes: { up: number; down: number };
  parentReplyId?: string;
  replies?: Reply[];
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  author: User;
  category: ThreadCategory;
  createdAt: string;
  votes: { up: number; down: number };
  replies: Reply[];
  viewCount: number;
  tags: string[];
  isPinned?: boolean;
  attachment?: Post;
  collaborationDetails?: {
    roles: string[];
    compensation: string;
  };
}

export type StudioProjectStatus = 'planning' | 'recording' | 'mixing' | 'mastering' | 'completed';

export interface Task {
    id: string;
    title: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    assignees: User[];
    description: string;
    comments: { user: User; text: string; createdAt: string }[];
}

export interface File {
    id: string;
    name: string;
    type: 'audio' | 'midi' | 'document' | 'other';
    url: string;
    uploadedBy: User;
    uploadedAt: string;
    version: number;
}

export interface StudioProjectMessage {
    id: string;
    user: User;
    text: string;
    createdAt: string;
}

export interface StudioProject {
  id: string;
  title: string;
  description: string;
  status: StudioProjectStatus;
  tags: string[];
  genre: string;
  coverImage?: string;
  bpm?: number;
  key?: string;
  deadline?: string;
  template?: ProjectTemplate;
  contributors: { user: User; role: string }[];
  lastUpdatedAt: string;
  progress: number;
  isPublic: boolean;
  tasks: Task[];
  files: File[];
  messages: StudioProjectMessage[];
}

export type ProjectTemplate = 'kpop' | 'hiphop' | 'edm' | 'ost' | 'lofi' | 'custom';

export interface ProjectMilestone {
  id: string;
  name: string;
  dueDate?: string;
  completed: boolean;
}

export interface Team {
    id: string;
    name: string;
    description: string;
    members: { user: User; role: 'Admin' | 'Member' }[];
    projectIds: string[];
    createdAt: string;
}

export interface AITool {
  name: string;
  iconUrl: string;
}

export interface Prompt {
  id: string;
  title: string;
  text: string;
  parameters: { [key: string]: string };
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  finalTrack: Media;
  aiTools: AITool[];
  prompts: Prompt[];
  tags: string[];
  credits: { user: User; role: string }[];
  createdAt: string;
  likes: number;
  viewCount: number;
}

export interface ActivityNotification {
    id: string;
    type: 'revenue' | 'follow' | 'message' | 'like' | 'music_shared' | 'general';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    metadata?: {
        avatarUrl?: string;
        amount?: string;
    };
}