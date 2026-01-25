/**
 * Animation Performance Monitor
 * Tracks FPS and detects low performance scenarios
 */
export class AnimationPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private fpsThreshold = 30; // Minimum acceptable FPS
  private isMonitoring = false;
  private animationFrameId: number | null = null;

  /**
   * Start monitoring animation performance
   * @param onLowPerformance Callback when FPS drops below threshold
   */
  startMonitoring(onLowPerformance: () => void) {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();

    const checkPerformance = () => {
      this.frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - this.lastTime;

      if (elapsed >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / elapsed);
        this.frameCount = 0;
        this.lastTime = currentTime;

        if (this.fps < this.fpsThreshold) {
          onLowPerformance();
        }
      }

      if (this.isMonitoring) {
        this.animationFrameId = requestAnimationFrame(checkPerformance);
      }
    };

    this.animationFrameId = requestAnimationFrame(checkPerformance);
  }

  /**
   * Stop monitoring animation performance
   */
  stopMonitoring() {
    this.isMonitoring = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Set FPS threshold for low performance detection
   */
  setFPSThreshold(threshold: number) {
    this.fpsThreshold = threshold;
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new AnimationPerformanceMonitor();
