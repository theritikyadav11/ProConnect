export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (kept empty if LandingNavbar is global) */}
      {/* <header className="max-w-7xl mx-auto w-full px-4 py-6"></header> */}

      {/* Main Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Text Content */}
          <div>
            <h1 className="text-5xl font-extrabold leading-tight text-[#0b1220]">
              Connect with Friends <br /> without Exaggeration.
            </h1>
            <p className="mt-6 text-gray-600 max-w-xl">
              A true social media revolution — no filters, no flex, just real
              stories. No noise. No bluffs. Just raw, unfiltered truth from real
              people.
            </p>
            <div className="mt-8">
              <a
                href="/register"
                className="inline-block bg-[#0b1220] text-white px-6 py-3 rounded-2xl shadow hover:opacity-95"
              >
                Join Now
              </a>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="flex justify-center">
            {/* Put your hero image inside public/images/hero-1.jpg */}
            <img
              src="/images/hero-img.png"
              alt="Landing hero"
              className="w-full max-w-lg object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
