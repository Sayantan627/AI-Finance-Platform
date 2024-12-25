import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl text-blue-300">Welth</h1>
      <Button variant="destructive" className="m-4">
        Click Me
      </Button>
    </>
  );
}
