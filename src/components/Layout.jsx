function Layout({ sidebar, content }) {
    return (
        <div className="flex h-[calc(100vh-3.5rem)]">
            {/* Sidebar */}
            <aside
                className="w-1/3 max-w-sm bg-[#f3f2f1] dark:bg-[#252423] 
                   border-r border-[#edebe9] dark:border-[#3b3a39] 
                   overflow-y-auto"
            >
                {sidebar}
            </aside>

            <main
                className="flex-1 bg-white dark:bg-[#1b1a19] 
                   text-[#323130] dark:text-[#f3f2f1] 
                   p-6 overflow-y-auto"
            >
                {content}
            </main>
        </div>
    );
}

export default Layout;
