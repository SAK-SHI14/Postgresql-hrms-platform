const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-[900px] h-[520px] bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-2">

                {/* LEFT SIDE */}
                <div className="bg-indigo-600 text-white p-10 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold mb-4">AstraHR</h1>
                    <h2 className="text-xl font-semibold mb-2">{title}</h2>
                    <p className="text-sm opacity-90">{subtitle}</p>
                </div>

                {/* RIGHT SIDE */}
                <div className="p-10 flex flex-col justify-center">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default AuthLayout;
