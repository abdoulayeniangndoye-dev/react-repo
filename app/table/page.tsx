"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type User = {
  id: number;
  email: string;
  password?: string;
  remember: boolean;
  expiresAt?: number;
};

export default function Table() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // États de la nouvelle popup
  const [showPwd, setShowPwd] = useState(false);
  const [blink, setBlink] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const cleanExpired = () => {
      const saved: User[] = JSON.parse(localStorage.getItem("users") || "[]");
      const valid = saved.filter((u) => !u.expiresAt || u.expiresAt > Date.now());

      if (valid.length !== saved.length) {
        localStorage.setItem("users", JSON.stringify(valid));
      }
      setUsers(valid);
    };

    cleanExpired();
    const interval = setInterval(cleanExpired, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fermer la popup avec Échap
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Remettre le mot de passe en masqué à chaque nouvelle popup
  useEffect(() => {
    setShowPwd(false);
    setCopied(false);
  }, [selectedUser?.id]);

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setDeletingId(null);
      if (selectedUser?.id === id) setSelectedUser(null);
    }, 500);
  };

  const toggleEye = () => {
    setBlink(false);
    requestAnimationFrame(() => setBlink(true)); // relance le clin d'œil
    setTimeout(() => setShowPwd((s) => !s), 150);
  };

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* copie non autorisée : on ne fait rien */
    }
  };

  const getName = (email: string) => email.split("@")[0];
  const getInitials = (email: string) => email.slice(0, 2).toUpperCase();

  const hasPassword = Boolean(selectedUser?.password);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* Animation du clin d'œil (à garder dans ce fichier) */}
      <style>{`
        @keyframes eye-blink { 0%{transform:scaleY(1)} 45%{transform:scaleY(.08)} 100%{transform:scaleY(1)} }
        .eye-blink svg { animation: eye-blink .32s ease; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) { .eye-blink svg { animation: none; } }
      `}</style>

      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
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

        <div className="relative overflow-x-auto w-full mt-10 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-100 dark:bg-zinc-800 text-xs font-medium">
              <tr>
                <th className="px-6 py-4">Remember</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Password</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-zinc-500">
                    Aucun utilisateur enregistré.
                  </td>
                </tr>
              ) : (
                users.slice(-2).map((user) => (
                  <tr
                    key={user.id}
                    className={`border-t border-zinc-200 dark:border-zinc-700 transition-all duration-300 ${
                      deletingId === user.id
                        ? "bg-red-100 dark:bg-red-950 opacity-60"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <td className="px-6 py-5">{user.remember ? "Oui" : "Non"}</td>
                    <td className="px-6 py-5">{user.email}</td>
                    <td className="px-6 py-5">{"••••••••"}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          aria-label="Voir"
                          className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          aria-label="Supprimer"
                          className={`p-1.5 rounded-full transition-colors ${
                            deletingId === user.id
                              ? "bg-red-600 text-white"
                              : "text-red-600 hover:bg-red-100"
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* POPUP : s'ouvre au clic sur l'œil du tableau */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
          onClick={() => setSelectedUser(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-name"
        >
          <div
            className="w-full max-w-md rounded-[28px] overflow-hidden bg-white dark:bg-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête dégradé */}
            <div className="relative flex items-center gap-4 bg-gradient-to-br from-[#5b4bff] via-[#8a5cff] to-[#c36bff] px-6 pt-7 pb-5 text-white">
              <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-[22px] bg-white text-2xl font-extrabold text-[#4a3bdc] ring-4 ring-white/30">
                {getInitials(selectedUser.email)}
              </div>
              <div className="min-w-0">
                <h2 id="popup-name" className="text-xl font-extrabold leading-tight break-words">
                  {getName(selectedUser.email)}
                </h2>
                <p className="mt-1 text-sm text-white/85 break-all">{selectedUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                aria-label="Fermer"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xl leading-none text-white hover:bg-white/30"
              >
                ×
              </button>
            </div>

            {/* Pastilles de statut */}
            <div className="flex flex-wrap gap-2 px-6 pt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <i className="h-[7px] w-[7px] rounded-full bg-current" />
                Compte actif
              </span>
              {!hasPassword && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  <i className="h-[7px] w-[7px] rounded-full bg-current" />
                  Mot de passe à définir
                </span>
              )}
            </div>

            {/* Informations */}
            <div className="px-6 pt-3 pb-2 divide-y divide-zinc-200 dark:divide-zinc-700">
              {/* Nom */}
              <div className="flex items-center gap-3 py-3.5">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-[#5b4bff] dark:bg-zinc-800 dark:text-[#8c80ff]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-zinc-500">Nom</p>
                  <p className="mt-0.5 text-[15px] font-semibold break-words">{getName(selectedUser.email)}</p>
                </div>
              </div>

              {/* E-mail */}
              <div className="flex items-center gap-3 py-3.5">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-[#5b4bff] dark:bg-zinc-800 dark:text-[#8c80ff]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 8 8 6 8-6" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-zinc-500">E-mail</p>
                  <p className="mt-0.5 text-[15px] font-semibold break-all">{selectedUser.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyEmail(selectedUser.email)}
                  className="shrink-0 rounded-[10px] border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:hover:text-white"
                >
                  {copied ? "Copié" : "Copier"}
                </button>
              </div>

              {/* Mot de passe + œil rond */}
              <div className="flex items-center gap-3 py-3.5">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-[#5b4bff] dark:bg-zinc-800 dark:text-[#8c80ff]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="11" width="14" height="10" rx="3" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-zinc-500">Mot de passe</p>
                  <p
                    className={`mt-0.5 text-[15px] break-all ${
                      showPwd ? "font-medium italic text-zinc-500" : "font-semibold tracking-[3px]"
                    }`}
                  >
                    {showPwd ? selectedUser.password ?? "Non enregistré" : "••••••••"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleEye}
                  onAnimationEnd={() => setBlink(false)}
                  aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  aria-pressed={showPwd}
                  className={`${blink ? "eye-blink" : ""} flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-[#5b4bff] hover:border-[#5b4bff] dark:border-zinc-700 dark:bg-zinc-800 dark:text-[#8c80ff]`}
                >
                  {showPwd ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 6.1A10 10 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.6 6.7C3.8 8.4 2 12 2 12s3.6 7 10 7c1.6 0 3-.4 4.3-1" />
                      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Remember */}
              <div className="flex items-center gap-3 py-3.5">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-[#5b4bff] dark:bg-zinc-800 dark:text-[#8c80ff]">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-zinc-500">Remember</p>
                  <p className="mt-0.5 text-[15px] font-semibold">
                    {selectedUser.remember ? "Acceptées" : "Non acceptées"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 px-6 pt-2 pb-6">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="flex-1 rounded-2xl bg-[#5b4bff] py-3 text-sm font-bold text-white hover:bg-[#4a3bdc]"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => handleDelete(selectedUser.id)}
                className="flex-1 rounded-2xl bg-red-100 py-3 text-sm font-bold text-red-600 hover:bg-red-200 dark:bg-red-950 dark:text-red-300"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}