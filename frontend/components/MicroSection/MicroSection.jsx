import MicroMentorshipThread from "./MicroMentorshipThread";
import MicroProjects from "./MicroProjects";
import TopProfiles from "./TopProfiles";

export default function MicroSection() {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full h-full flex flex-col space-y-4">
      {/* Mentorship Threads */}
      <MicroMentorshipThread />
      {/* Micro Projects */}
      <MicroProjects />
      {/* Top Profiles */}
      <TopProfiles />
    </div>
  );
}
