import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function ProblemSolution() {
  return (
    <section className="bg-background min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-5/12 mb-8 md:mb-0">
          <h2 className="text-3xl font-bold mb-4">The Problem</h2>
          <p className="text-lg">
            We consume hours of podcast content but often struggle to retain the
            information. Traditional note-taking is time-consuming and
            interrupts the listening experience.
          </p>
        </div>
        <div className="hidden md:block">
          <ArrowForwardIcon style={{ fontSize: 48 }} />
        </div>
        <div className="md:w-5/12">
          <h2 className="text-3xl font-bold mb-4">The Solution</h2>
          <p className="text-lg">
            PodLearn uses advanced AI to analyze podcasts, extract key
            information, and create personalized learning materials. Review and
            reinforce your knowledge effortlessly, even while you sleep.
          </p>
        </div>
      </div>
    </section>
  );
}
