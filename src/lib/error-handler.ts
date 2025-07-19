// 全局错误处理器
export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorQueue: Error[] = [];
  private isProcessing = false;

  private constructor() {
    this.setupGlobalHandlers();
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  private setupGlobalHandlers() {
    // 处理未捕获的Promise错误
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        console.warn('Unhandled promise rejection:', event.reason);
        this.handleError(new Error(`Unhandled promise rejection: ${event.reason}`));
        // 阻止默认的控制台错误输出
        event.preventDefault();
      });

      // 处理全局错误
      window.addEventListener('error', (event) => {
        console.warn('Global error:', event.error);
        this.handleError(event.error || new Error(event.message));
      });
    }
  }

  private async handleError(error: Error) {
    // 过滤掉一些已知的无害错误
    if (this.shouldIgnoreError(error)) {
      return;
    }

    this.errorQueue.push(error);
    
    if (!this.isProcessing) {
      this.processErrorQueue();
    }
  }

  private shouldIgnoreError(error: Error): boolean {
    const ignoredMessages = [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'ChunkLoadError',
      'Loading chunk',
      'Loading CSS chunk',
      'A listener indicated an asynchronous response by returning true',
      'Extension context invalidated',
      'chrome-extension://',
      'moz-extension://',
    ];

    return ignoredMessages.some(msg => 
      error.message?.includes(msg) || error.stack?.includes(msg)
    );
  }

  private async processErrorQueue() {
    this.isProcessing = true;

    while (this.errorQueue.length > 0) {
      const error = this.errorQueue.shift();
      if (error) {
        // 在开发环境中记录错误，生产环境中可以发送到错误监控服务
        if (process.env.NODE_ENV === 'development') {
          console.group('🔍 Handled Error');
          console.error('Error:', error.message);
          console.error('Stack:', error.stack);
          console.groupEnd();
        }
      }
      
      // 避免阻塞主线程
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    this.isProcessing = false;
  }

  // 手动报告错误
  public reportError(error: Error, context?: string) {
    const enhancedError = new Error(`${context ? `[${context}] ` : ''}${error.message}`);
    enhancedError.stack = error.stack;
    this.handleError(enhancedError);
  }
}

// 初始化全局错误处理器
if (typeof window !== 'undefined') {
  GlobalErrorHandler.getInstance();
}

// 导出便捷函数
export const reportError = (error: Error, context?: string) => {
  GlobalErrorHandler.getInstance().reportError(error, context);
};
