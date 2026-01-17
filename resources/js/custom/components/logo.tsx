export function Logo() {
    return (
        <div className="flex items-center gap-2 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white font-bold text-[#F96901]">
                OS
            </div>
            <div className="relative text-lg font-bold text-white">
                <div className="absolute top-[-20px]">OrderSystem</div>
                <span className="absolute top-[-15] text-[0.8rem]">Admin</span>
            </div>
        </div>
    );
}
