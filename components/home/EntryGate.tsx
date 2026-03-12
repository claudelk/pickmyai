"use client"

interface EntryGateProps {
  onSelectPath: (path: "a" | "b") => void
}

export function EntryGate({ onSelectPath }: EntryGateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
          Not sure which AI to use?
        </h1>
        <p className="text-lg text-slate-500">
          Try them all at once. No account needed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => onSelectPath("a")}
            className="px-8 py-4 text-base font-medium rounded-lg border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
          >
            I know AI
          </button>
          <button
            onClick={() => onSelectPath("b")}
            className="px-8 py-4 text-base font-medium rounded-lg border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500"
          >
            I am new to AI
          </button>
        </div>
      </div>

      <div className="mt-24">
        <a href="#how-it-works" className="text-sm text-slate-400 hover:text-slate-600 transition-colors duration-200">
          How it works
        </a>
      </div>

      <div id="how-it-works" className="max-w-3xl w-full pt-24 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#2563EB]">1</div>
            <h3 className="font-medium text-slate-900">Choose</h3>
            <p className="text-sm text-slate-500">Tell us what you need help with, or pick a path.</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#2563EB]">2</div>
            <h3 className="font-medium text-slate-900">Compare</h3>
            <p className="text-sm text-slate-500">See how six different AIs respond to your exact prompt.</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-[#2563EB]">3</div>
            <h3 className="font-medium text-slate-900">Decide</h3>
            <p className="text-sm text-slate-500">Get a recommendation and try the best one for free.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
