// Next.js automatically shows this while the page server component is fetching.
// It mirrors the layout of ProductDetailClient so there's no layout shift.

export default function ProductDetailLoading() {
    return (
        <div className="font-sans animate-pulse">

            {/* Back link */}
            <div className="max-w-6xl mx-auto px-6 pt-8">
                <div className="h-4 w-28 bg-white/8 rounded-full" />
            </div>

            {/* ── Main grid ── */}
            <section className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                {/* Left — hero image with shimmer */}
                <div className="relative aspect-video bg-white/5 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent" />
                </div>

                {/* Right — info */}
                <div className="flex flex-col gap-5">
                    <div className="h-3 w-20 bg-white/8 rounded-full" />

                    <div className="flex flex-col gap-2">
                        <div className="h-7 w-3/4 bg-white/10 rounded-xl" />
                        <div className="h-7 w-1/2 bg-white/8 rounded-xl" />
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                        <div className="h-3.5 w-full bg-white/6 rounded-full" />
                        <div className="h-3.5 w-5/6 bg-white/6 rounded-full" />
                        <div className="h-3.5 w-4/6 bg-white/6 rounded-full" />
                    </div>

                    {/* Price row */}
                    <div className="flex items-baseline gap-3 py-4 border-y border-white/8">
                        <div className="h-10 w-32 bg-white/10 rounded-xl" />
                        <div className="h-5 w-20 bg-white/6 rounded-full" />
                        <div className="h-6 w-24 bg-emerald-500/10 rounded-full" />
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap gap-2">
                        <div className="h-7 w-28 bg-white/6 rounded-full" />
                        <div className="h-7 w-24 bg-white/6 rounded-full" />
                        <div className="h-7 w-24 bg-white/6 rounded-full" />
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-col gap-3">
                        <div className="h-14 w-full bg-white/8 rounded-full" />
                        <div className="h-14 w-full bg-white/5 border border-white/8 rounded-full" />
                    </div>
                </div>
            </section>

            {/* ── Stats grid ── */}
            <section className="max-w-6xl mx-auto px-6 pb-10">
                <div className="h-5 w-36 bg-white/8 rounded-xl mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white/4 border border-white/8 rounded-2xl p-4 flex flex-col gap-2">
                            <div className="h-3 w-16 bg-white/8 rounded-full" />
                            <div className="h-4 w-20 bg-white/10 rounded-full" />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── What's included ── */}
            <section className="max-w-6xl mx-auto px-6 pb-10">
                <div className="h-5 w-36 bg-white/8 rounded-xl mb-4" />
                <div className="bg-white/4 border border-white/8 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500/15 shrink-0" />
                            <div
                                className="h-3.5 bg-white/6 rounded-full"
                                style={{ width: `${55 + (i % 3) * 15}%` }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Related products ── */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="h-5 w-40 bg-white/8 rounded-xl mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
                            {/* Thumbnail with staggered shimmer */}
                            <div className="aspect-video bg-white/6 relative overflow-hidden">
                                <div
                                    className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            </div>
                            <div className="p-4 flex flex-col gap-2.5">
                                <div className="h-4 w-4/5 bg-white/8 rounded-full" />
                                <div className="h-3 w-3/5 bg-white/6 rounded-full" />
                                <div className="h-3 w-2/5 bg-white/6 rounded-full" />
                                <div className="h-6 w-24 bg-white/8 rounded-full mt-1" />
                                <div className="flex gap-2 mt-1">
                                    <div className="h-9 flex-1 bg-white/6 rounded-full" />
                                    <div className="h-9 flex-1 bg-red-500/10 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
