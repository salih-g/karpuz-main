export default function ActionButton({ children }) {
    return (
        <div className='px-1 py-1.5 mr-1 text-xs text-gray-200 rounded cursor-pointer hover:bg-gray-400'>
            {children}
        </div>
    );
}
