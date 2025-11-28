// data.ts
import { User, Media, Post, Comment, Notification, Conversation, Message, Playlist, Thread, StudioProject, Team, ActivityNotification, Task, File as ProjectFile, StudioProjectMessage, PortfolioProject, CollaborationReview } from './types';

export const users: Record<string, User> = {
  user1: {
    id: 'user1',
    name: '신스웨이브 키드',
    handle: '@synthwavekid',
    avatarUrl: 'https://picsum.photos/seed/user1/100/100',
    isOnline: true,
    isFollowing: false,
    isContributor: true,
    bio: '80년대 신스웨이브에 빠져있습니다. AI로 추억의 분위기를 만들어요.',
    genreTags: ['신스웨이브', '레트로웨이브', '80년대'],
    followersCount: 1200,
    followingCount: 89,
    followingIds: ['user2', 'user3', 'user4'],
    skillTags: ['Suno AI', 'Udio', '프롬프트 엔지니어링', '마스터링', '커버 아트'],
    equipment: ['Suno Pro', 'Udio Pro', 'iZotope Ozone 11', 'Adobe Audition'],
    collaborationRating: 4.8,
    completedCollabs: 23,
    responseRate: 95,
  },
  user2: {
    id: 'user2',
    name: '로파이 소녀',
    handle: '@lofigirl',
    avatarUrl: 'https://picsum.photos/seed/user2/100/100',
    isOnline: false,
    isFollowing: true,
    isContributor: true,
    bio: '칠/로파이 비트를 들으며 공부하는 평범한 소녀.',
    genreTags: ['로파이', '칠합', '공부 비트'],
    followersCount: 5800,
    followingCount: 150,
    followingIds: ['user1'],
    skillTags: ['Suno AI', '비트메이킹', '샘플링', '믹싱'],
    equipment: ['Suno Pro', 'FL Studio', 'Splice'],
    collaborationRating: 4.9,
    completedCollabs: 45,
    responseRate: 88,
  },
  user3: {
    id: 'user3',
    name: '하이퍼팝 공주',
    handle: '@hyperpop',
    avatarUrl: 'https://picsum.photos/seed/user3/100/100',
    isOnline: true,
    isFollowing: true,
    isContributor: true,
    bio: 'brrrr하는 사운드를 만들어요.',
    genreTags: ['하이퍼팝', '글리치코어', '실험음악'],
    followersCount: 8900,
    followingCount: 200,
    followingIds: ['user1', 'user5'],
    skillTags: ['Udio', '보컬 프로세싱', '사운드 디자인', '글리치 아트'],
    equipment: ['Udio Pro', 'Ableton Live', 'Serum', 'Portal'],
    collaborationRating: 4.6,
    completedCollabs: 31,
    responseRate: 72,
  },
  user4: {
    id: 'user4',
    name: '앰비언트 드리머',
    handle: '@ambientdreamer',
    avatarUrl: 'https://picsum.photos/seed/user4/100/100',
    isOnline: false,
    isFollowing: true,
    isContributor: false,
    bio: '사운드스케이프를 유영합니다. 집중과 휴식을 위한 앰비언트 음악을 만들어요.',
    genreTags: ['앰비언트', '드론', '미니멀'],
    followersCount: 2300,
    followingCount: 50,
    followingIds: ['user1'],
    skillTags: ['Suno AI', '필드 레코딩', '사운드스케이프', '명상 음악'],
    equipment: ['Suno Basic', 'Zoom H6', 'Logic Pro'],
    collaborationRating: 4.7,
    completedCollabs: 12,
    responseRate: 91,
  },
  user5: {
    id: 'user5',
    name: '시네마틱 마스터',
    handle: '@cinematicmaster',
    avatarUrl: 'https://picsum.photos/seed/user5/100/100',
    isOnline: true,
    isFollowing: false,
    isContributor: true,
    bio: '아직 존재하지 않는 영화를 위한 웅장한 스코어를 작곡합니다.',
    genreTags: ['시네마틱', '오케스트라', '사운드트랙'],
    followersCount: 12000,
    followingCount: 300,
    followingIds: [],
    skillTags: ['Suno AI', 'AIVA', '오케스트레이션', '영화 음악', '게임 음악'],
    equipment: ['Suno Pro', 'AIVA Pro', 'Spitfire Audio', 'Cubase'],
    collaborationRating: 4.9,
    completedCollabs: 67,
    responseRate: 98,
  },
};

export const mediaItems: Record<string, Media> = {
  media1: { id: 'media1', title: '네온 선셋 드라이브', artist: '신스웨이브 키드', fileUrl: '/audio/synth.mp3', albumArtUrl: 'https://picsum.photos/seed/media1/500/500', mediaType: 'audio', duration: 185, genre: '신스웨이브' },
  media2: { id: 'media2', title: '비 오는 날 공부', artist: '로파이 소녀', fileUrl: '/audio/lofi.mp3', albumArtUrl: 'https://picsum.photos/seed/media2/500/500', mediaType: 'audio', duration: 210, genre: '로파이' },
  media3: { id: 'media3', title: '매트릭스 속 글리치', artist: '하이퍼팝 공주', fileUrl: '/audio/hyperpop.mp3', albumArtUrl: 'https://picsum.photos/seed/media3/500/500', mediaType: 'audio', duration: 150, genre: '하이퍼팝' },
  media4: { id: 'media4', title: '떠다니는 질감', artist: '앰비언트 드리머', fileUrl: '/audio/ambient.mp3', albumArtUrl: 'https://picsum.photos/seed/media4/500/500', mediaType: 'audio', duration: 320, genre: '앰비언트' },
  media5: { id: 'media5', title: '장엄한 여정', artist: '시네마틱 마스터', fileUrl: '/audio/cinematic.mp3', albumArtUrl: 'https://picsum.photos/seed/media5/500/500', mediaType: 'audio', duration: 240, genre: '시네마틱' },
  media6: { id: 'media6', title: '도쿄의 야경', artist: '신스웨이브 키드', fileUrl: 'https://picsum.photos/seed/media6-img/500/500', albumArtUrl: 'https://picsum.photos/seed/media6-art/500/500', mediaType: 'image', genre: '사진' },
};

const comments: Comment[] = [
    { id: 'c1', author: users.user2, content: '정말 편안해요! 공부할 때 듣기 딱 좋네요.', createdAt: '2시간 전', likes: 15, timestamp: 35 },
    { id: 'c2', author: users.user4, content: '여기서 만드신 분위기가 정말 마음에 들어요.', createdAt: '1시간 전', likes: 8, timestamp: 92 },
    { id: 'c3', author: users.user3, content: '와 2분 10초 드랍 미쳤다 🔥', createdAt: '30분 전', likes: 22, timestamp: 130 },
];

export const posts: Post[] = [
  { id: 'post1', author: users.user1, postedAt: '2시간 전', description: '늦은 밤 드라이브에서 영감을 받은 새로운 신스웨이브 트랙입니다. 들어보시고 어떻게 생각하시는지 알려주세요!', media: mediaItems.media1, likes: 543, comments: comments, portfolioProjectId: 'pp1' },
  { id: 'post2', author: users.user2, postedAt: '5시간 전', description: '집중하는 데 도움이 될 새로운 로파이 비트입니다. 즐겁게 공부하세요!', media: mediaItems.media2, likes: 892, comments: [], portfolioProjectId: 'pp2' },
  { id: 'post3', author: users.user3, postedAt: '1일 전', description: '삑삑- 이게 제 새 트랙이에요 🤖', media: mediaItems.media3, likes: 1204, comments: [], portfolioProjectId: 'pp3' },
  { id: 'post4', author: users.user4, postedAt: '2일 전', description: '명상과 깊은 집중을 위한 긴 앰비언트 곡입니다.', media: mediaItems.media4, likes: 451, comments: [] },
  { id: 'post5', author: users.user5, postedAt: '3일 전', description: '이 곡으로 장대한 전투 장면을 상상해봤습니다.', media: mediaItems.media5, likes: 2341, comments: [], portfolioProjectId: 'pp4' },
  { id: 'post6', author: users.user1, postedAt: '4일 전', description: '제 음악을 위한 시각적 영감 몇 가지입니다.', media: mediaItems.media6, likes: 321, comments: [] },
];

export const fetchPosts = (page: number, limit = 5): Promise<{ data: Post[], hasMore: boolean }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedPosts = posts.slice(start, end);
      resolve({
        data: paginatedPosts,
        hasMore: end < posts.length,
      });
    }, 500);
  });
};

export const activityNotifications: ActivityNotification[] = [
    { id: 'an1', type: 'revenue', title: '월간 수익 정산', message: '11월 수익으로 $1,234.56를 받았습니다.', timestamp: '1일 전', isRead: false },
    { id: 'an2', type: 'follow', title: '새로운 팔로워', message: '로파이 소녀님이 팔로우하기 시작했습니다.', timestamp: '2일 전', isRead: false, metadata: { avatarUrl: users.user2.avatarUrl } },
    { id: 'an3', type: 'like', title: '내 트랙에 좋아요', message: '하이퍼팝 공주님이 네온 선셋 드라이브를 좋아합니다.', timestamp: '3일 전', isRead: true, metadata: { avatarUrl: users.user3.avatarUrl } },
    { id: 'an4', type: 'message', title: '새 메시지', message: '앰비언트 드리머님으로부터 새 메시지가 있습니다.', timestamp: '3일 전', isRead: true, metadata: { avatarUrl: users.user4.avatarUrl } },
    { id: 'an5', type: 'music_shared', title: '트랙 공유됨', message: '시네마틱 마스터님이 내 트랙 비 오는 날 공부를 공유했습니다.', timestamp: '4일 전', isRead: true, metadata: { avatarUrl: users.user5.avatarUrl } },
];

export const conversations: Conversation[] = [
    {
        id: 'conv1',
        participants: [users.user1, users.user2],
        messages: [
            { id: 'm1', conversationId: 'conv1', senderId: 'user2', content: '안녕하세요! 새 트랙 정말 좋네요.', type: 'text', timestamp: '오전 10:30', isRead: true },
            { id: 'm2', conversationId: 'conv1', senderId: 'user1', content: '정말 고마워요! 님 로파이 비트는 집중할 때 항상 들어요.', type: 'text', timestamp: '오전 10:32', isRead: true },
        ],
        unreadCount: 0,
    },
    {
        id: 'conv2',
        participants: [users.user1, users.user3, users.user5],
        messages: [
            { id: 'm3', conversationId: 'conv2', senderId: 'user3', content: '콜라보 아이디어: 하이퍼팝 x 시네마틱 스코어 어때요? 🤪', type: 'text', timestamp: '어제', isRead: false },
        ],
        unreadCount: 1,
    },
    {
        id: 'conv3',
        participants: [users.user1, users.user4],
        messages: [
            { id: 'm4', conversationId: 'conv3', senderId: 'user1', content: posts[0], type: 'post_share', timestamp: '어제', isRead: true },
        ],
        unreadCount: 0,
    },
];

export const playlists: Playlist[] = [
    { id: 'pl1', name: '나의 신스웨이브 보석함', authorId: 'user1', description: '제 최고의 신스웨이브 트랙 모음입니다.', trackIds: ['media1'], coverArtUrl: mediaItems.media1.albumArtUrl },
    { id: 'pl2', name: '집중의 영역', authorId: 'user1', description: '딥 워크를 위한 트랙들.', trackIds: ['media2', 'media4'], coverArtUrl: [mediaItems.media2.albumArtUrl, mediaItems.media4.albumArtUrl, mediaItems.media1.albumArtUrl, mediaItems.media5.albumArtUrl] },
];

export const sampleReplies: Reply[] = [
    { id: 'r1', author: users.user2, content: '좋은 생각이네요! 저도 로파이 트랙에 보컬을 찾고 있었어요.', createdAt: '2025-11-27T10:00:00Z', votes: { up: 5, down: 0 } },
    { id: 'r2', author: users.user4, content: '흥미롭네요. 어떤 분위기를 생각하고 계신가요?', createdAt: '2025-11-27T11:00:00Z', votes: { up: 2, down: 0 }, parentReplyId: 'r1', replies: [
        { id: 'r3', author: users.user2, content: '아주 차분하고 멜랑콜리한 느낌이요.', createdAt: '2025-11-27T12:00:00Z', votes: { up: 1, down: 0 } }
    ]},
];

export const sampleThreads: Thread[] = [
    { id: 't1', title: '신스웨이브 트랙에 보컬 구합니다', content: '새로운 연주곡에 힘 있는 여성 보컬이 필요합니다. The Midnight이나 Gunship 같은 느낌을 생각하고 있어요. 관심 있으시면 DM 주세요!', author: users.user1, category: 'collaboration', createdAt: '2025-11-27T09:00:00Z', votes: { up: 25, down: 2 }, replies: sampleReplies, viewCount: 1200, tags: ['보컬', '신스웨이브', '콜라보'], isPinned: true, collaborationDetails: { roles: ['보컬리스트'], compensation: '수익 분배' } },
    { id: 't2', title: '11월 로파이 챌린지: "비 오는 밤"', content: '이달의 챌린지는 비 오는 밤의 감성을 담은 로파이 트랙 만들기입니다. 마감은 11월 30일!', author: users.user2, category: 'challenge', createdAt: '2025-11-25T08:00:00Z', votes: { up: 50, down: 1 }, replies: [], viewCount: 2500, tags: ['챌린지', '로파이'], isPinned: true },
    { id: 't3', title: '제 새 하이퍼팝 트랙 믹스 피드백 부탁드려요', content: '여러분, 방금 새 트랙 믹스를 마쳤습니다. 킥 드럼 소리가 너무 큰가요? 의견을 들려주세요!', author: users.user3, category: 'feedback', createdAt: '2025-11-26T15:00:00Z', votes: { up: 15, down: 0 }, replies: [], viewCount: 800, tags: ['피드백', '믹싱', '하이퍼팝'], attachment: posts[2] },
    { id: 't4', title: '사이드체인 컴프레션은 어떻게 사용하나요?', content: '안녕하세요, 프로듀싱 초보입니다. 킥과 베이스를 분리하기 위해 사이드체인 컴프레션을 사용하는 방법을 다들 어떻게 하시나요? Ableton Live를 사용 중인데, 자세한 튜토리얼이나 팁이 있을까요?', author: users.user4, category: 'general', createdAt: '2025-11-24T11:00:00Z', votes: { up: 18, down: 0 }, replies: [], viewCount: 950, tags: ['사이드체인', '프로듀싱', 'Ableton', '질문'] },
    { id: 't5', title: '새로운 AI 음악 생성기 "Udio"에 대한 생각', content: '최근에 Udio를 사용해봤는데, 결과물의 품질에 정말 놀랐습니다. Suno와 비교해서 어떤 장단점이 있다고 생각하시나요? 여러분의 경험을 공유해주세요.', author: users.user5, category: 'general', createdAt: '2025-11-23T18:00:00Z', votes: { up: 42, down: 3 }, replies: [], viewCount: 1800, tags: ['Udio', 'AI음악', '토론'] },
    { id: 't6', title: '요즘 유행하는 음악 트렌드는 무엇일까요?', content: '최근 음악 씬에서 어떤 장르나 스타일이 떠오르고 있다고 느끼시나요? 저는 저지 클럽(Jersey Club) 리듬이 점점 더 많이 들리는 것 같아요.', author: users.user1, category: 'general', createdAt: '2025-11-22T14:00:00Z', votes: { up: 33, down: 1 }, replies: [], viewCount: 1500, tags: ['트렌드', '저지클럽', '토론'] },
    { id: 't7', title: '제 새 앰비언트 트랙 "떠다니는 질감" 공유합니다', content: '최근에 작업한 앰비언트 트랙입니다. 명상이나 휴식 시간에 듣기 좋게 만들어봤어요. 들어보시고 감상평 남겨주시면 감사하겠습니다!', author: users.user4, category: 'showcase', createdAt: '2025-11-21T10:00:00Z', votes: { up: 60, down: 0 }, replies: [], viewCount: 1900, tags: ['앰비언트', '작품공유', '신곡'], attachment: posts[3] },
    { id: 't8', title: '영화음악풍 트랙 만들어봤어요!', content: '장엄한 전투씬을 상상하며 만든 시네마틱 트랙입니다. 여러분은 어떤 장면이 떠오르시나요?', author: users.user5, category: 'showcase', createdAt: '2025-11-20T16:00:00Z', votes: { up: 80, down: 2 }, replies: [], viewCount: 2200, tags: ['시네마틱', '오케스트라', '작품공유'], attachment: posts[4] },
];

export const fetchThreads = (): Promise<Thread[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(sampleThreads);
    }, 500);
  });
};

const projectTasks: Task[] = [
    { id: 'task1', title: '메인 멜로디 작성', status: 'completed', priority: 'high', dueDate: '2025-11-20', assignees: [users.user1], description: '코러스의 메인 신스 리드를 작곡합니다.', comments: [] },
    { id: 'task2', title: '베이스라인 녹음', status: 'in-progress', priority: 'high', dueDate: '2025-11-25', assignees: [users.user2], description: '그루비한 베이스라인을 녹음합니다.', comments: [{ user: users.user1, text: "Prophet 스타일 베이스 사운드로 해보죠.", createdAt: '2025-11-22T10:00:00Z' }] },
    { id: 'task3', title: '드럼 패턴 편곡', status: 'todo', priority: 'medium', dueDate: '2025-11-30', assignees: [users.user1], description: '벌스와 코러스 드럼 패턴을 만듭니다.', comments: [] },
    { id: 'task4', title: '보컬 믹싱', status: 'todo', priority: 'low', dueDate: '2025-12-05', assignees: [users.user3], description: '보컬 트랙을 처리하고 믹싱합니다.', comments: [] },
];

const projectFiles: ProjectFile[] = [
    { id: 'file1', name: '메인_신스_리드.wav', type: 'audio', url: '#', uploadedBy: users.user1, uploadedAt: '2025-11-20T14:00:00Z', version: 2 },
    { id: 'file2', name: '프로젝트_개요.pdf', type: 'document', url: '#', uploadedBy: users.user1, uploadedAt: '2025-11-15T09:00:00Z', version: 1 },
];

const projectMessages: StudioProjectMessage[] = [
    { id: 'pm1', user: users.user1, text: "팀 여러분, 이 프로젝트를 시작합시다! 먼저 메인 멜로디부터요.", createdAt: '2025-11-15T09:05:00Z' },
    { id: 'pm2', user: users.user2, text: "좋아요! 베이스라인 아이디어를 구상해볼게요.", createdAt: '2025-11-15T09:10:00Z' },
];

export const sampleStudioProjects: StudioProject[] = [
    { id: 'proj1', title: '사이버펑크 드림', description: '미래 도시를 위한 어두운 신스웨이브 트랙.', status: 'recording', tags: ['신스웨이브', '사이버펑크', '80년대'], genre: '신스웨이브', coverImage: 'https://picsum.photos/seed/proj1/400/400', bpm: 128, key: 'Am', contributors: [{ user: users.user1, role: '프로듀서' }, { user: users.user2, role: '베이스' }, { user: users.user3, role: '보컬' }], lastUpdatedAt: new Date().toISOString(), progress: 45, isPublic: false, tasks: projectTasks, files: projectFiles, messages: projectMessages },
    { id: 'proj2', title: '오케스트라 피날레', description: '영화 스코어를 위한 웅장한 오케스트라 곡.', status: 'mixing', tags: ['시네마틱', '오케스트라'], genre: 'OST', coverImage: 'https://picsum.photos/seed/proj2/400/400', bpm: 90, key: 'D Major', contributors: [{ user: users.user5, role: '작곡가' }], lastUpdatedAt: '2025-11-25T11:00:00Z', progress: 75, isPublic: false, tasks: [], files: [], messages: [] },
    { id: 'proj3', title: '공개 로파이 잼', description: '편안한 로파이 트랙을 만드는 커뮤니티 프로젝트. 누구나 참여할 수 있습니다!', status: 'planning', tags: ['로파이', '커뮤니티', '잼'], genre: '로파이', coverImage: 'https://picsum.photos/seed/proj3/400/400', bpm: 85, key: 'F Major', contributors: [{ user: users.user2, role: '리드' }, { user: users.user4, role: '패드' }], lastUpdatedAt: '2025-11-24T18:00:00Z', progress: 10, isPublic: true, tasks: [], files: [], messages: [] },
    { id: 'proj4', title: '앨범 마스터링', description: '곧 나올 "디지털 노스탤지어" 앨범의 최종 마스터링.', status: 'completed', tags: ['마스터링', '앨범'], genre: '신스웨이브', coverImage: 'https://picsum.photos/seed/proj4/400/400', contributors: [{ user: users.user1, role: '엔지니어' }], lastUpdatedAt: '2025-11-10T10:00:00Z', progress: 100, isPublic: false, tasks: [], files: [], messages: [] },
];

export const sampleTeams: Team[] = [
    { id: 'team1', name: '신스웨이브 연합', description: '진정한 80년대 감성의 신스웨이브 음악을 만드는 팀.', members: [{ user: users.user1, role: 'Admin' }, { user: users.user4, role: 'Member' }], projectIds: ['proj1'], createdAt: '2025-06-15T10:00:00Z' },
    { id: 'team2', name: '스코어 작곡가들', description: '영화, TV, 게임을 위한 웅장한 음악을 만듭니다.', members: [{ user: users.user5, role: 'Admin' }], projectIds: ['proj2'], createdAt: '2025-07-20T11:00:00Z' },
];

export const samplePortfolioProjects: PortfolioProject[] = [
  {
    id: 'pp1',
    title: '네온 선셋 드라이브',
    description: `
**프로젝트 목표:** 늦은 밤 도시 드라이브의 감성을 담은 신스웨이브 트랙 만들기.

**제작 과정:**
1.  **멜로디 생성:** Suno AI를 사용하여 "80년대, 신스, 레트로, 시네마틱"에 초점을 맞춘 간단한 프롬프트로 메인 멜로디를 생성하며 시작했습니다.
2.  **드럼 머신:** Udio AI를 사용하여 클래식 LinnDrum 샘플로 펀치감 있는 드럼 트랙을 만들었습니다. 핵심은 그 게이트 리버브 스네어 사운드를 얻는 것이었습니다.
3.  **베이스라인:** 베이스라인도 Udio로 생성했으며, "Juno-106 스타일 아르페지오 베이스"를 프롬프트로 사용했습니다.
4.  **편곡 및 믹싱:** 생성된 모든 스템을 Ableton Live로 가져왔습니다. 섹션을 편곡하고, 필터 스윕을 추가하고, 모든 것을 하나로 묶기 위해 믹싱했습니다. 최종 마스터에는 빈티지한 느낌을 위해 약간의 테이프 새츄레이션을 추가했습니다.

**도전 과제:** 가장 큰 도전은 각기 다른 AI로 생성된 파트들이 조화롭게 들리게 하는 것이었습니다. 자연스럽게 어우러지게 하려면 DAW에서 수동 편집과 EQ 조정이 필요했습니다.
    `,
    coverImageUrl: 'https://picsum.photos/seed/pp1/800/600',
    finalTrack: mediaItems.media1,
    aiTools: [
      { name: 'Suno', iconUrl: '/icons/suno.png' },
      { name: 'Udio', iconUrl: '/icons/udio.png' },
      { name: 'Ableton Live', iconUrl: '/icons/ableton.png' }
    ],
    prompts: [
      {
        id: 'p1',
        title: '메인 멜로디 (Suno)',
        text: '웅장하고 향수 어린 80년대 신스웨이브 멜로디, 시네마틱하며 약간의 멜랑콜리가 있음. 드라이빙 비트.',
        parameters: { '스타일': '신스웨이브', '분위기': '향수', '악기 구성': '신스 리드, 패드' }
      },
      {
        id: 'p2',
        title: '드럼 트랙 (Udio)',
        text: '강력한 80년대 드럼 비트, LinnDrum 샘플, 스네어에 게이트 리버브, 120 BPM.',
        parameters: { 'BPM': '120', '키트': 'LinnDrum', '리버브': '게이트 홀' }
      }
    ],
    tags: ['신스웨이브', '80년대', '시네마틱', 'Suno', 'Udio'],
    credits: [
      { user: users.user1, role: '리드 프로듀서' },
      { user: users.user4, role: '믹싱 엔지니어' }
    ],
    createdAt: '2025-10-15T10:00:00Z',
    likes: 1250,
    viewCount: 15800
  },
  {
    id: 'pp2',
    title: '로파이 드림',
    description: `
**프로젝트 목표:** 공부나 휴식에 완벽한 차분한 로파이 트랙.

**제작 과정:**
1.  **피아노 루프:** AIVA를 사용하여 간단하고 반복적인 멜로디에 초점을 맞춰 멜랑콜리한 피아노 루프를 생성했습니다.
2.  **비트 & 베이스:** Suno를 사용하여 따뜻한 바이닐 크랙클 효과와 간단한 서브 베이스 라인이 있는 클래식 로파이 힙합 비트를 만들었습니다.
3.  **분위기:** 분위기를 더하기 위해 로열티 프리 라이브러리에서 비 오는 날 사운드 효과를 추가했습니다.
4.  **마무리:** Ableton에서 믹싱하며 킥에서 피아노로 사이드체인 컴프레션을 적용하여 특징적인 펌핑 효과를 만들었습니다.
    `,
    coverImageUrl: 'https://picsum.photos/seed/pp2/800/600',
    finalTrack: mediaItems.media2,
    aiTools: [
      { name: 'AIVA', iconUrl: '/icons/aiva.png' },
      { name: 'Suno', iconUrl: '/icons/suno.png' },
      { name: 'Ableton Live', iconUrl: '/icons/ableton.png' }
    ],
    prompts: [
      {
        id: 'p3',
        title: '피아노 멜로디 (AIVA)',
        text: '느리고 멜랑콜리하며 간단한 피아노 멜로디. 로파이 힙합 스타일, 단조.',
        parameters: { '감정': '멜랑콜리', '키': 'C 마이너', '악기 구성': '그랜드 피아노' }
      }
    ],
    tags: ['로파이', '칠합', '공부 비트', 'AIVA', 'Suno'],
    credits: [
      { user: users.user2, role: '프로듀서' }
    ],
    createdAt: '2025-10-10T14:30:00Z',
    likes: 2800,
    viewCount: 32000
  },
  {
    id: 'pp3',
    title: '글리치 캔디',
    description: `
**프로젝트 목표:** 공격적이면서도 팝적인 감성을 지닌 하이퍼팝 트랙을 제작.

**제작 과정:**
1.  **보컬 찹 생성:** Splice에서 보컬 샘플을 찾은 뒤, Ableton Live의 Simpler로 잘게 썰어 글리치한 멜로디 라인을 만들었습니다.
2.  **드럼 & 베이스:** Udio AI에 "heavily distorted 808 bass"와 "punchy, aggressive hyperpop drums"라고 프롬프트하여 강력한 리듬 섹션을 생성했습니다.
3.  **신스 레이어링:** Serum을 사용하여 여러 개의 디튠된 슈퍼쏘우(supersaw) 신스를 레이어링하여 풍부하고 혼란스러운 질감을 만들었습니다.
4.  **마무리:** 과도한 컴프레션과 새츄레이션을 사용하여 모든 사운드를 의도적으로 찌그러뜨려 하이퍼팝 특유의 '깨지는' 느낌을 극대화했습니다.

**도전 과제:** 너무 많은 사운드 레이어가 서로 충돌하지 않고 각자의 공간을 가지도록 믹싱하는 것이 어려웠습니다. 파노라마와 EQ를 정밀하게 조정하는 데 많은 시간을 쏟았습니다.
    `,
    coverImageUrl: 'https://picsum.photos/seed/pp3/800/600',
    finalTrack: mediaItems.media3,
    aiTools: [
      { name: 'Udio', iconUrl: '/icons/udio.png' },
      { name: 'Splice', iconUrl: '/icons/splice.png' },
      { name: 'Serum', iconUrl: '/icons/serum.png' },
      { name: 'Ableton Live', iconUrl: '/icons/ableton.png' }
    ],
    prompts: [
      {
        id: 'p4',
        title: '드럼 & 베이스 (Udio)',
        text: 'An aggressive and punchy hyperpop rhythm section with heavily distorted 808 bass and glitchy hi-hats, 160 BPM.',
        parameters: { '장르': '하이퍼팝', 'BPM': '160', '느낌': '공격적, 펀치감' }
      }
    ],
    tags: ['하이퍼팝', '글리치코어', 'Udio', 'Serum'],
    credits: [
      { user: users.user3, role: '리드 프로듀서' }
    ],
    createdAt: '2025-10-20T11:00:00Z',
    likes: 4500,
    viewCount: 65000
  },
  {
    id: 'pp4',
    title: '잃어버린 왕국을 찾아서',
    description: `
**프로젝트 목표:** 고대 유적을 탐험하는 어드벤처 영화의 메인 테마 음악 제작.

**제작 과정:**
1.  **메인 오케스트라 테마:** AIVA를 사용하여 "웅장하고, 모험적이며, 신비로운 오케스트라 테마"를 프롬프트로 기본 멜로디와 화성을 생성했습니다. AIVA가 제안한 여러 버전 중 가장 감동적인 것을 선택했습니다.
2.  **민속 악기 추가:** 생성된 오케스트라 스템에 나무 플루트와 민속 타악기 샘플을 수동으로 추가하여 고대의 신비로운 느낌을 더했습니다.
3.  **사운드 디자인:** 동굴의 울림이나 바람 소리 같은 앰비언스 사운드 이펙트를 추가하여 공간감을 극대화했습니다.
4.  **최종 믹싱 및 마스터링:** 오케스트라의 다이내믹 레인지를 최대한 살리면서도, 각 악기 소리가 명확하게 들리도록 믹싱하는 데 집중했습니다.

**도전 과제:** AI가 생성한 오케스트라 사운드에 실제 악기 샘플을 자연스럽게 섞는 것이 까다로웠습니다. 리버브와 공간 시뮬레이션 플러그인을 사용하여 두 사운드 소스가 같은 공간에서 연주되는 것처럼 느끼게 하는 것이 핵심이었습니다.
    `,
    coverImageUrl: 'https://picsum.photos/seed/pp4/800/600',
    finalTrack: mediaItems.media5,
    aiTools: [
      { name: 'AIVA', iconUrl: '/icons/aiva.png' },
      { name: 'Kontakt', iconUrl: '/icons/kontakt.png' },
      { name: 'Pro Tools', iconUrl: '/icons/protools.png' }
    ],
    prompts: [
      {
        id: 'p5',
        title: '메인 테마 (AIVA)',
        text: 'A grand, adventurous, and mysterious orchestral theme for a fantasy film. Soaring strings, powerful brass, and subtle woodwinds.',
        parameters: { '감정': '웅장함, 모험', '장르': '영화 스코어', '키': 'D 마이너' }
      }
    ],
    tags: ['시네마틱', '오케스트라', '사운드트랙', 'AIVA'],
    credits: [
      { user: users.user5, role: '작곡가' },
      { user: users.user1, role: '사운드 디자이너' }
    ],
    createdAt: '2025-10-22T18:00:00Z',
    likes: 8200,
    viewCount: 120000
  }
];

export const collaborationReviews: Record<string, CollaborationReview[]> = {
  user1: [
    {
      id: 'cr1',
      reviewer: users.user2,
      projectTitle: '레트로 신스 콜라보',
      rating: 5,
      comment: '정말 프로페셔널하고 소통이 원활했어요. 프롬프트 작성 실력이 뛰어나서 원하는 사운드를 빠르게 찾을 수 있었습니다.',
      createdAt: '2025-11-15',
      role: '프롬프트 엔지니어'
    },
    {
      id: 'cr2',
      reviewer: users.user3,
      projectTitle: '하이퍼신스 프로젝트',
      rating: 5,
      comment: '마스터링 실력이 정말 좋아요. 제 글리치한 사운드를 완벽하게 정리해주셨어요.',
      createdAt: '2025-11-10',
      role: '마스터링 엔지니어'
    },
    {
      id: 'cr3',
      reviewer: users.user5,
      projectTitle: '잃어버린 왕국을 찾아서',
      rating: 4,
      comment: '사운드 디자인 센스가 좋습니다. 작업 속도도 빠르고 피드백 반영도 잘해주셔서 좋았어요.',
      createdAt: '2025-10-25',
      role: '사운드 디자이너'
    }
  ],
  user2: [
    {
      id: 'cr4',
      reviewer: users.user1,
      projectTitle: '네온 드림스',
      rating: 5,
      comment: '로파이 비트메이킹의 정석을 보여주셨어요. 샘플 선정 능력이 탁월합니다.',
      createdAt: '2025-11-12',
      role: '비트메이커'
    }
  ],
  user5: [
    {
      id: 'cr5',
      reviewer: users.user1,
      projectTitle: '잃어버린 왕국을 찾아서',
      rating: 5,
      comment: '시네마틱 작곡의 대가입니다. AIVA 활용 능력이 놀라워요.',
      createdAt: '2025-10-28',
      role: '작곡가'
    },
    {
      id: 'cr6',
      reviewer: users.user3,
      projectTitle: '에픽 인트로',
      rating: 5,
      comment: '오케스트레이션 감각이 뛰어나요. 덕분에 제 채널 인트로가 완전히 달라졌어요!',
      createdAt: '2025-10-20',
      role: '작곡가'
    }
  ]
};
