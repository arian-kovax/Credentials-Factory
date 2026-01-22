import college from "../assets/college.jpg";

export default function AuthLayout({ children }) {
  return (
    <div className="w-screen h-screen">
      <div className="flex h-full w-full overflow-hidden">
        
        {/* Left panel */}
        <div className="w-1/2 h-full">
          <img 
          src={college}
          alt="College"
          className="w-full h-full object-cover"/>
        </div>

        {/* Right panel */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-full max-w-form">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
