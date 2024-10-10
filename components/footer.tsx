export default function Footer() {
  return (
    <footer className="bg-background text-foreground py-8 px-8">
      <div className="container mx-auto">
        <p className="text-center">
          © {new Date().getFullYear()} PodLearn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
