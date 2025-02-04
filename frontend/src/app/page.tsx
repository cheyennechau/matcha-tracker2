"use client"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden p-6">

      {/* Application Title */}
      <h1 className="text-4xl font-bold">Matcha Tracker</h1>

      {/* Subtitle / Description */}
      <p className="mt-4 text-lg text-primary-color">Track your matcha purchases with ease.</p>
    </div>
  );
}