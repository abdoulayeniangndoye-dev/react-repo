"use client";

import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
    const [message, setMessage] = useState("Bienvenue sur mon Dashboard !");
    const [compteur, setCompteur] = useState(0);
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-row" >
          <Link href="/about" type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center rounded-[10px] leading-5 mr-5">About</Link>
          <Link href="/dashboard" type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center rounded-[10px] leading-5 mr-5">Dashboard</Link>
                      <Link href="/formulaire" type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center rounded-[10px] leading-5 mr-5">Form</Link>
                      <Link href="/table" type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center rounded-[10px] leading-5 mr-5">Table</Link>

        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Bienvenue sur le site web Dashboard{" "}
            <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
              de ce mois
            </code>{" "}
            de novembre.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Ce site est un lieu pour apprendre React pas à pas.{" "}

          </p>
          <button
  onClick={() => setMessage("Bravo ! Tu viens de créer ta première interaction React !")}
  className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
>
  Clique ici
</button>
<button
  onClick={() => {
    console.log("Bouton cliqué");
    setCompteur((ancienCompteur) => ancienCompteur + 1);
  }}
  className="bg-green-600 text-white px-5 py-3 rounded-lg mt-4"
>
  Ajouter 1
</button>


<p className="mt-4 text-blue-600">
  {message}
</p>
        </div>
      </main>
    </div>
  );
}
