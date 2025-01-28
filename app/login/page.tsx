import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
    return (
      <div className="min-h-screen flex bg-gradient-to-b from-gray-900 to-black">
        {/* Left decorative section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-violet-500/10 backdrop-blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-violet-900/20 to-transparent"></div>
          <div className="relative w-full h-full flex items-center justify-center p-12">
            <h1 className="text-5xl font-bold text-white/90 tracking-wider">Welcome Back</h1>
          </div>
        </div>
        
        {/* Right login section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-gray-400">Please sign in to continue</p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent rounded-xl"></div>
              <div className="relative bg-gray-800/50 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }