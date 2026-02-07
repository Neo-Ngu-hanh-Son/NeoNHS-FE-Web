export default function WorkshopCalendarPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Workshop Calendar</h1>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-[#d3e4da] dark:border-white/10 shadow-sm min-h-[500px] flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">calendar_month</span>
                <p className="text-xl font-medium text-gray-600">Calendar View Coming Soon</p>
                <p className="text-gray-400 max-w-sm mt-2">
                    A full interactive calendar will be implemented here to manage your workshop schedules and sessions.
                </p>
            </div>
        </div>
    );
}
