export default function WorkshopSessionsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Workshop Sessions</h1>
                <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined">add_circle</span>
                    Create Session
                </button>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-12 rounded-xl border border-[#d3e4da] dark:border-white/10 shadow-sm text-center">
                <p className="text-gray-500">Manage your active and upcoming workshop sessions here.</p>
            </div>
        </div>
    );
}
