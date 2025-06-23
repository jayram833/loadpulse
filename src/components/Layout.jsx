function Layout({ sidebar, content }) {
    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <aside className="w-1/3 max-w-sm bg-white dark:bg-[#2b2b2b] border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                {sidebar}
            </aside>
            <main className="flex-1 bg-gray-50 dark:bg-[#1e1e1e] p-6 overflow-y-auto">
                {content}
            </main>
        </div>
    )
}

export default Layout
