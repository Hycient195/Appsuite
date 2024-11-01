import Image from "next/image";
// import notFoundImg from "@assets/not-found/404-img.svg";
import notFoundImg from "@/../public/assets/not-found/404-img.svg";
import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ filter: "grayscale(100"}} className="h-screen grid place-content-center text-center justify-center">
      <section className="flex flex-col gap-4 max-w-xl p-5">
        <figure className=" w-full aspect-[4/3] relative h-auto">
          <Image fill src={notFoundImg} alt="Page not found" className="object-contain w-full" />
        </figure>
        <p className="text-zinc-400">
          The page you seek is unavailable
        </p>
        <Link href="/" className="btn !btn-rounded bg-black/90 !rounded-full text-white max-w-max mx-auto mt-5">Homepage</Link>
      </section>
    </main>
  )
}