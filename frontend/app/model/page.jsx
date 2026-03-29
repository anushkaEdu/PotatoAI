import ModelStats from "../../components/ModelStats";

export default function ModelPage() {
  return (
    <div className="min-h-screen bg-dark pt-24 w-full">
      <div className="max-w-4xl mx-auto text-center px-4 mb-10">
        <h1 className="text-5xl font-playfair font-bold text-text mb-6">Model Architecture</h1>
        <p className="text-lg text-text/60 font-inter">
          A definitive outline of our analytical capacities, precision diagnostics, and underlying structural layer pipelines.
        </p>
      </div>

      <ModelStats />
    </div>
  );
}
