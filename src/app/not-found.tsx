import { Button } from "@/components/ui";
export default function NotFound() {
  return (
    <div className="container route-page">
      <p className="eyebrow">404 / OUT OF PLAY</p>
      <h1>Back to the diamond.</h1>
      <p className="intro">That page could not be found.</p>
      <Button href="/">Back to home</Button>
    </div>
  );
}
