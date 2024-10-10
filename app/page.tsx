import Header from "@/components/header";
import Footer from "@/components/footer";
import ProblemSolution from "@/components/ProblemSolution";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Header />
        <ProblemSolution />
      </main>
      <Footer />
    </div>
  );
}
