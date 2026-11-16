"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Form() {
  const router = useRouter();
  const [isMessage, setIsMessage] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
const User = {
  id: Date.now(),
  email: formData.email,
  password: formData.password,
  remember: formData.remember,
  expiresAt: Date.now() + 10000, // 10 secondes (mets 5000 pour 5 secondes)
};
    // Récupérer les utilisateurs déjà enregistrés
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Créer un nouvel utilisateur (sans le mot de passe)
    const newUser = {
      id: Date.now(),
      email: formData.email,
      remember: formData.remember,
    };

    // Enregistrer dans localStorage
    localStorage.setItem("users", JSON.stringify([...savedUsers, newUser]));

    console.log("Utilisateur enregistré :", newUser);
    setIsMessage(true);

    // Rediriger vers le tableau
    router.push("/table");
  };

  const links = [
    { href: "/about", label: "About", color: "blue" },
    { href: "/dashboard", label: "Dashboard", color: "green" },
    { href: "/formulaire", label: "Form", color: "purple" },
    { href: "/table", label: "Table", color: "blue" },
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* Navigation (garde ici tes classes de boutons colorés) */}
        <div className="flex flex-row">
  <Link
    href="/about"
    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-blue-800/80 font-medium text-sm px-4 py-2.5 text-center rounded-[10px] leading-5 mr-5"
  >
    About
  </Link>
  <Link
    href="/dashboard"
    className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-green-800/80 font-medium text-sm px-4 py-2.5 text-center rounded-[10px] leading-5 mr-5"
  >
    Dashboard
  </Link>
  <Link
    href="/formulaire"
    className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-purple-800/80 font-medium text-sm px-4 py-2.5 text-center rounded-[10px] leading-5 mr-5"
  >
    Form
  </Link>
  <Link
    href="/table"
    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-blue-800/80 font-medium text-sm px-4 py-2.5 text-center rounded-[10px] leading-5"
  >
    Table
  </Link>
</div>

        <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2.5 text-sm font-medium">
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border text-sm rounded block w-full px-3 py-2.5"
              placeholder="name@flowbite.com"
              required
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2.5 text-sm font-medium">
              Your password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border text-sm rounded block w-full px-3 py-2.5"
              placeholder="••••••••"
              required
            />
          </div>

          <label htmlFor="remember" className="flex items-center mb-5">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={handleChange}
              className="w-4 h-4 border rounded"
            />
            <span className="ms-2 text-sm font-medium select-none">
              Remember me
            </span>
          </label>

          <button
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded text-sm px-4 py-2.5"
          >
            Submit
          </button>

          {isMessage && (
            <p className="mt-4 text-green-600">
              Form data submitted successfully!
            </p>
          )}
        </form>
      </main>
    </div>
  );
}