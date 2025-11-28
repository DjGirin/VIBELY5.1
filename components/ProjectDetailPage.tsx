import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { PortfolioProject, User } from '../types';
import { CaretLeftIcon, PlayIcon, HeartIcon, EyeIcon } from './icons'; // Assuming these icons exist

interface ProjectDetailPageProps {
  project: PortfolioProject;
  onBack: () => void;
  onNavigateToProfile: (userId: string) => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, onBack, onNavigateToProfile }) => {
  return (
    <div className="bg-light-bg text-light-text-primary p-4 sm:p-6 md:p-8">
      <header className="mb-6">
        <button onClick={onBack} className="flex items-center text-light-text-secondary hover:text-light-text-primary transition-colors mb-4">
          <CaretLeftIcon className="w-5 h-5 mr-2" />
          <span>프로필로 돌아가기</span>
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold text-light-text-primary">{project.title}</h1>
        <div className="flex items-center mt-2 text-light-text-secondary text-sm">
          <span>By </span>
          {project.credits.map((credit, index) => (
            <React.Fragment key={credit.user.id}>
              <button onClick={() => onNavigateToProfile(credit.user.id)} className="font-semibold hover:underline mx-1">{credit.user.name}</button>
              {index < project.credits.length - 1 && <span>,</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <img src={project.coverImageUrl} alt={`${project.title} cover art`} className="w-full rounded-lg shadow-lg object-cover" />
          </div>

          <div className="mb-8 p-4 bg-light-bg-secondary rounded-lg">
             <h2 className="text-2xl font-bold mb-4">최종 트랙</h2>
             <div className="flex items-center bg-light-bg p-4 rounded-lg">
                <img src={project.finalTrack.albumArtUrl} alt="앨범 아트" className="w-16 h-16 rounded-md mr-4" />
                <div className="flex-grow">
                    <p className="font-bold text-lg">{project.finalTrack.title}</p>
                    <p className="text-light-text-secondary">{project.finalTrack.artist}</p>
                </div>
                <button className="bg-brand-purple text-white p-3 rounded-full hover:scale-105 transition-transform">
                    <PlayIcon className="w-6 h-6" />
                </button>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none bg-light-bg-secondary p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">이 프로젝트에 대하여</h2>
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{project.description}</ReactMarkdown>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-light-bg-secondary p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-around text-center mb-4">
                    <div className="flex items-center">
                        <HeartIcon className="w-5 h-5 mr-2 text-brand-pink" />
                        <div>
                            <p className="font-bold text-lg">{project.likes.toLocaleString()}</p>
                            <p className="text-xs text-light-text-secondary">좋아요</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <EyeIcon className="w-5 h-5 mr-2 text-brand-purple" />
                        <div>
                            <p className="font-bold text-lg">{project.viewCount.toLocaleString()}</p>
                            <p className="text-xs text-light-text-secondary">조회수</p>
                        </div>
                    </div>
                </div>
                 <button className="w-full bg-gradient-to-r from-brand-pink to-brand-purple text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    프로젝트 좋아요
                </button>
            </div>

            <div className="bg-light-bg-secondary p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4">사용한 AI 도구</h3>
              <div className="space-y-4">
                {project.aiTools.map(tool => (
                  <div key={tool.name} className="flex items-center">
                    <img src={tool.iconUrl} alt={tool.name} className="w-8 h-8 rounded-md mr-4 bg-gray-700" />
                    <span className="font-semibold">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>

             <div className="bg-light-bg-secondary p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4">프롬프트</h3>
              {project.prompts.map(prompt => (
                <div key={prompt.id} className="mb-4 last:mb-0">
                  <p className="font-semibold text-light-text-primary mb-1">{prompt.title}</p>
                  <p className="text-sm bg-light-bg p-3 rounded-md text-light-text-secondary font-mono">"{prompt.text}"</p>
                </div>
              ))}
            </div>

            <div className="bg-light-bg-secondary p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">만든 사람들</h3>
              <div className="space-y-4">
                {project.credits.map(credit => (
                  <div key={credit.user.id} className="flex items-center">
                    <img src={credit.user.avatarUrl} alt={credit.user.name} className="w-10 h-10 rounded-full mr-4" />
                    <div>
                      <button onClick={() => onNavigateToProfile(credit.user.id)} className="font-bold hover:underline">{credit.user.name}</button>
                      <p className="text-sm text-light-text-secondary">{credit.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
