import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error message safely without logging complex objects that might cause circular reference errors
    console.error("ErrorBoundary caught an error:", error.message);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#E9F5E1] p-4">
          <div className="bg-[#FFFEF2] p-8 rounded-[2.5rem] border-8 border-[#E6D7B5] shadow-xl max-w-md text-center">
            <div className="w-20 h-20 bg-[#F49449] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-sm">
              ⚠️
            </div>
            <h2 className="text-2xl font-black text-[#5B4D3C] mb-2">發生了一點小錯誤！</h2>
            <p className="text-[#5B4D3C] opacity-80 font-bold mb-6">
              哎呀！程式遇到了一些亂流。請重新整理頁面試試看！
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#4DB5E6] text-white px-8 py-3 rounded-full font-black shadow-sm hover:bg-[#3CA0D0] transition-transform active:scale-95 border-b-4 border-[#2B80A8] active:border-b-0 active:translate-y-1"
            >
              重新整理
            </button>
            <div className="mt-6 p-4 bg-red-50 rounded-xl text-left">
                <p className="text-xs font-mono text-red-800 break-all">
                    {this.state.error?.message}
                </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}